import React from 'react';
import "./Comment.css"

const Comment = (props) => {
    return (
        <div className="Comment">
            <li>User Id: {props.item.user_id}</li>
            <li>Comments Content: {props.item.content}</li>
        </div>
    );
};

export default Comment;