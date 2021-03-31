import React from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import Moment from 'react-moment';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

export default function TaskTree(props) {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
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