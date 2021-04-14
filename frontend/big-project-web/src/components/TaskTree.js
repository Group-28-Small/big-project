import React from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import Moment from 'react-moment';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Container, Fab, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router';
import PlayPauseButton from './PlayPauseButton';
import EditTaskButton from './EditTaskButton';

export default function TaskTree(props) {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const styles = useStyles();
    const history = useHistory();
    if (!tasks) {
        return <div>Getting  tasks...</div>
    }
    const createNewTask = () => {
        history.push("/newtask/")
    }
    
    return (
        <Container>
            <Typography variant='h4' >Tasks</Typography>
            <TreeView>
                {tasks.map((item, idx) => {
                    return (
                        <TaskTreeItem 
                            nodeId={item.id} 
                            key={item.id} 
                            task={item} 
                            //onClick={() => editTask(item)} 
                            isLast={idx === tasks.length - 1}
                        />
                    );
                })}
            </TreeView>
            <Fab color="primary" aria-label="add" className={styles.fab} onClick={createNewTask}>
                <AddIcon />
            </Fab>
        </Container>
    );
}
function TaskTreeItem(props) {
    const { task, isLast, ...other } = props;
    const styles = useStyles();
    return (
        <TreeItem 
            label={
                <div className={`${styles.treeItem} ${isLast && styles.lastItem}`} >
                    {task.name}{' \t'}{task.estimated_time}{' hrs \t'}{task.percentage}{'% \t'}
                    <Moment format="DD MMMM YYYY" date={task.due_date} unix />
                    <div style={{marginRight: '0', marginLeft: 'auto'}}>
                        <EditTaskButton taskId={task.id}/>
                    </div>
                        <PlayPauseButton taskId={task.id}/>
                    
                </div>
            }
            {...other}
        />
    );
}


const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    // purely experimental - delete if you want
    treeItem: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: 'black',
        borderStyle: 'solid',
        padding: 4,
        alignItems: 'center',
        display: 'flex'
    },
    lastItem: {
        borderBottomWidth: 1,
    }
}));