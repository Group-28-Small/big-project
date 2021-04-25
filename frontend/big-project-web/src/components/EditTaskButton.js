import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';


export default function EditTaskButton(props) {
    const { taskId } = props;

    const editTask = () => {
        props.editCallback(taskId)
    }
    return (
        <div>
                <IconButton style={{ marginRight: '22px' }} size='small' onClick={editTask}>
                    <EditIcon />
                </IconButton>
        </div>
    );
} 