import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"
import "./dashboard.css"

function Dashboard() {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    function handlePost(e) {
        e.preventDefault();
        console.log(image.size)
        if (image.size > 1000000) {
            setError("File too large");
            return;
        }
        //add new post to list of posts
        const form = e.target;
        const formData = new FormData();
        formData.append('title', form[0].value)
        formData.append('content', form[1].value)
        formData.append('image', image)
        console.log(formData)

        fetch("/createPost", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            body: formData
        })
        .then(res => res.json())
            // setPosts([...posts,newPost])
            setModalIsOpen(false);

    }
    
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    }

    useEffect(() => {
        fetch("/isUserAuthenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }    
        })
        .then(res => res.json())
        .then(data => setIsAuthenticated(data.isAuthenticated)) 
        // fetch("/getUserPosts")
        // .then(res => res.json())
        // .then(data => setPosts(data.posts))
    }, []);

    function toggleModal() {
        setModalIsOpen(!modalIsOpen);
    }
    
    return (
            <div>
                {isAuthenticated ? (
                <div className="center wrapper">
                    <div className="right">
                        <button className="button-filled" onClick={toggleModal}>Create Post</button>
                    </div>
                    {posts.length > 0 ? (
                        <h1>Your Posts</h1>
                    ) : (
                        <h1>No Posts Yet</h1>
                    )}

                    {modalIsOpen && (
                        <div className="modal">
                            <form onSubmit={handlePost} enctype="multipart/formdata">
                                <span className="close-button" onClick={toggleModal}>&times;</span>
                                {error && <p>{error}</p>}
                                <div>
                                    <p className="left">Title</p>
                                    <input type="text" className="full-width medium-height styled-input" required={true}></input>
                                </div>
                                <div>
                                    <p className="left">Content</p>
                                    <textarea className="full-width styled-input long" required={true}></textarea>
                                </div>
                                <div>
                                    <p className="left">Picture graphic (optional)</p>
                                    <input type="file" className="full-width medium-height larger-upload left" accept="image/*" onChange={handleImageChange}></input>
                                </div>
                                <div>
                                    <input type="submit" className="full-width button-filled" value="Submit" />
                                </div>
                
                            </form>
                        </div>
                    )}
                </div>
                ) : (<></>)}
            </div>
    
        
        )

}
export default Dashboard;