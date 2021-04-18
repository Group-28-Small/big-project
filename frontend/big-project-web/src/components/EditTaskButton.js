import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router';
import IconButton from "@material-ui/core/IconButton";
import BlockIcon from '@material-ui/icons/Block';


export default function EditTaskButton(props) {
    const {taskId,  ...other} = props;

    const editTask = (task) => {
        props.editCallback(taskId)
    }
    return (
        <div>
                <IconButton size='small' onClick={editTask}>
                    <EditIcon />
                </IconButton>
        </div>
    );
} 