import { Container, makeStyles, Typography } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import moment from 'moment';
import React from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';

export default function SessionHistory(props) {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: sessions } = useFirestoreCollectionData(db.collection("sessions").where("user", "==", userDetailsRef).orderBy("start", "desc").orderBy("end", "desc")
    , {
        idField: 'id'
    });
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    var taskDict = {}
    if (tasks) {
        tasks.forEach((t) => {
            taskDict['tasks/' + t.id] = t
        });
    }

    return (
        <Container>
            <Typography style ={{paddingLeft: '47%', paddingTop: '0%'}} variant="h6">Recent</Typography>
            <hr/>
           <TreeView style ={{paddingLeft: '40%', paddingTop: '0%'}} disableSelection>
               
                {sessions ? sessions.map((item) => {
                    var task = taskDict[item.task];
                    if(task === undefined)
                        return null;
                    var duration = moment.duration((item.end - item.start) * 1000).humanize();
                    //var startDate = () => {return <Moment unix date={now} format="" />}; TODO: fix start date
                    return (
                        <TreeItem style ={{textAlign: 'center', paddingRight:'70%'}} label={
                            task.name + " for: " + duration
                        }/>
                    );
            }) : <Typography>No data to show</Typography>
            }
           </TreeView>
        </Container>
    );
}

const styles = makeStyles((theme) => ({
    floatinBtn: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 5
    },
    sessions: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        margin: 4,
    },
    activeTask: {
        borderColor: '#05FF1E',
        borderWidth: 4,
        margin: 2,
    }
}));