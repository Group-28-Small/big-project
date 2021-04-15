import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router';
import IconButton from "@material-ui/core/IconButton";
import BlockIcon from '@material-ui/icons/Block';


export default function EditTaskButton(props) {
    const [editing, setEditing] = useState(false);
    const history = useHistory();
    const {taskId,  ...other} = props;

    const editTask = (task) => {
        history.push("/edittask/" + taskId);
    }

    const cancelEdit = () => {
        history.push("/");
    }

    useEffect(() => {
        return history.listen((location) => {
            var urlParts = location.pathname.split('/edittask/');
            if(urlParts.length <= 1) { //if no '/edittask/' found
                setEditing(false);
            }
            else if(urlParts.includes(taskId)) //if current editing is in array
                setEditing(true);
            else //swap to false if swapped off of
                setEditing(false);
        })
    }, [history]);

    return (
        <div>
            {!editing ? 
                <IconButton size='small' onClick={editTask}>
                    <EditIcon />
                </IconButton>
            :
                <IconButton size='small' onClick={cancelEdit}>
                    <BlockIcon />
                </IconButton>
            }
        </div>
    );
} 