import React, { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router';
import IconButton from "@material-ui/core/IconButton";
import BlockIcon from '@material-ui/icons/Block';


export default function EditTaskButton(props) {
    const [editing, setEditing] = useState(false);
    const history = useHistory();
    const {taskId, ...other} = props;


    const editTask = (task) => {
        if(history.location.pathname.length < 2) //TODO: find a better way
        {
            history.push("/edittask/" + taskId);
            setEditing(true);
        }
    }

    const cancelEdit = () => {
        history.push("/");
        setEditing(false);
    }

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