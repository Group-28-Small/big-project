import { Grid } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { backend_address, total_url } from 'big-project-common';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useFirebaseApp, useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';


export default function Sunburst(props) {
    const { data: user } = useUser();
    const firebase = useFirebaseApp();
    const db = useFirestore();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const [durations, setDurations] = useState({})
    const [onlyDone, setOnlyDone] = useState('all')
    useEffect(() => {
        // firebase tasks changed - fetch done tasks again
        console.log("data changed");
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            tasks.forEach((task) => {
                const url = backend_address(total_url + "/" + idToken + "/" + task.id)
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // so it turns out that setState callbacks can accept a function that recieves the old state
                        // if we update it from within, it's guaranteed to happen atomically
                        setDurations((oldDurations) => {
                            return { ...oldDurations, [task.id]: data.total_time }
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
            });
        }).catch((error) => {
            // this should never happen
        })
    }, [tasks])
    var values = []
    var labels = []
    tasks.forEach((task) => {
        if (onlyDone == 'only-not-done' && task.done) {
            return;
        } else if (onlyDone == 'only-done' && !task.done) {
            return;
        }
        labels.push(task.name);
        values.push(durations[task.id])
    })
    // console.log(values);
    // console.log(labels);
    // console.log(durations);
    var data = [{
        // once we have subtasks, this will be 'sunburst'
        type: "pie",
        labels: labels,
        values: values,
        outsidetextfont: { size: 20, color: "#377eb8" },
        // leaf: {opacity: 0.4},
        marker: { line: { width: 2 } },
    }];

    var layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"],
    };
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
        >
            <Grid item xs={8}>
                    <Plot
                        data={data}
                        layout={layout} config={{ displaylogo: false }} />
            </Grid>
            <Grid item>
                <ToggleButtonGroup value={onlyDone} onChange={(_, v) => setOnlyDone(v)} exclusive aria-label="text formatting">
                    <ToggleButton value="all" aria-label="bold">
                        All
                    </ToggleButton>
                    <ToggleButton value="only-done" aria-label="italic">
                        Only Done
                    </ToggleButton>
                    <ToggleButton value="only-not-done" aria-label="underlined">
                        Only Not Done
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        </Grid>
    )
}
