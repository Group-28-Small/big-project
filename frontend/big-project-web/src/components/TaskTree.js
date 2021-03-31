import React from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import Moment from 'react-moment';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

export default function TaskTree(props) {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const styles = useStyles();
    if (!tasks) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div>tasks</div>
            <TreeView>
                {tasks.map((item) => {
                    return (
                        <TaskTreeItem nodeId={item.id} key={item.id} task={item} />
                    );
                })}
            </TreeView>
            <Fab color="primary" aria-label="add" className={styles.fab}>
                <AddIcon />
            </Fab>
        </div>
    );
}
function TaskTreeItem(props) {
    const { task, ...other } = props;

    return (
        <TreeItem
            label={
                <div >
                    {task.name}{' \t'}{task.estimated_time}{' hrs \t'}{task.percentage}{'% \t'}<Moment format="DD MMMM YYYY" date={task.date} />
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
}));