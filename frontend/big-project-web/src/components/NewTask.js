import { Box, Button, Container, FormControlLabel, makeStyles, Slider, Switch, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { DateTimePicker } from "@material-ui/pickers";
import Moment from 'react-moment';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { Link } from 'react-router-dom';


export const EditTaskPage = props => {
    const db = useFirestore();
    const item_id = props.match.params.taskid;
    console.log(item_id);
    const itemRef = db.collection('tasks').doc(item_id);
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    if (item.data && user) {
        const data = item.data
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef} editing={true} {...props} />
    } else {
        // TODO
        return (
            <div>Loading...</div>
        )
    }

}
export const NewTaskPage = props => {
    const db = useFirestore();
    const [itemRef,] = useState(db.collection('tasks').doc());
    const { data: user } = useUser();
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const [timeSet, setTimeSet] = useState(false);
    if (item.data && user) {
        const data = item.data
        if (!timeSet) {
            data.due_date = (Date.now() / 1000) + (60 * 60 * 24);
            setTimeSet(true);
        }
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef} editing={false} {...props} />
    } else {
        // TODO
        return (
            <div>loading...</div>
        )
    }
}

function TaskEditor(props) {
    const db = useFirestore();
    const styles = useStyles();
    const [switchesState, setSwitchesState] = React.useState({
        hasDueDate: true,
        trackProgress: false,
    });

    const handleSwitchChange = (event) => {
        setSwitchesState({ ...switchesState, [event.target.name]: event.target.checked });
    };

    const { item, item_id, userRef, editing } = props;
    const [taskName, onChangeName] = React.useState(item.name ?? '');
    const [estimatedTime, onChangeTime] = React.useState(item.estimated_time ?? '');
    const [pct, onChangePct] = React.useState(item.percentage ?? 0);
    const [dueDate, setDueDate] = React.useState(new Date(item.due_date * 1000));
    const updateTask = () => {
        console.log(dueDate);
        db.collection("tasks").doc(item_id).set({ 'name': taskName, 'estimated_time': estimatedTime, 'percentage': pct, 'due_date': dueDate.getTime() / 1000, 'user': userRef }, { merge: true });
    }
    const deleteTask = () => {
        db.collection("tasks").doc(item_id).delete();
    }
    return (
        <Container maxWidth="md">
            <form>
                <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <TextField className={styles.field} required id='taskName' label='Task Name' type='text' variant='outlined' autoFocus={true} onChange={(e) => onChangeName(e.target.value)} value={taskName}></TextField>
                    <TextField className={styles.field} id='taskEstimated' type="text" label='Estimated Time' variant='outlined' onChange={(e) => onChangeTime(e.target.value)} value={estimatedTime}></TextField>
                    <FormControlLabel
                        control={<Switch checked={switchesState.trackProgress} name="trackProgress" onChange={handleSwitchChange} />}
                        label="Track Progress" labelPlacement="start" className={`${styles.field} ${styles.wide}`}
                    />
                    {switchesState.trackProgress && (
                        <div className={styles.field}>
                            Percentage: {pct}%
                            <Slider value={pct} onChange={(_, v) => { onChangePct(v) }} value={pct} aria-labelledby="continuous-slider" />
                        </div>
                    )}
                    <FormControlLabel
                        control={<Switch checked={switchesState.hasDueDate} name="hasDueDate" onChange={handleSwitchChange} />}
                        label="Has Due Date" labelPlacement="start" className={`${styles.field} ${styles.wide}`}
                    />
                    {switchesState.hasDueDate && (
                        <>
                            <DateTimePicker
                                label="DateTimePicker"
                                inputVariant="outlined"
                                value={dueDate}
                                onChange={(d) => { setDueDate(d.toDate()) }}
                                className={styles.field}
                            />
                            <div className={styles.field}>
                                Due: <Moment date={dueDate} fromNow />
                            </div>
                        </>
                    )}
                    {editing ?
                        <>
                            <Button variant='contained' color='primary' onClick={updateTask} component={Link} to={'/'}>Update Task</Button>
                            <Button variant='contained' color='secondary' onClick={deleteTask} component={Link} to={'/'}>Delete Task</Button>
                        </>
                    :
                        <Button variant='contained' color='primary' onClick={updateTask} component={Link} to={'/'}>Add Task</Button>}
                </Box>
            </form>
        </Container>
    )
}
const useStyles = makeStyles((theme) => ({
    field: {
        margin: 8,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        width: '50%'
    },
    wide: {
        justifyContent: 'space-between'
    }
}));
