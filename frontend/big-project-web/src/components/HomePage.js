import { Grid } from "@material-ui/core";
import { Route } from 'react-router-dom';
import { EditTaskPage, NewTaskPage } from "./NewTask";
import TaskTree from "./TaskTree";

export function Home() {
    return (
        <Grid
            container
            direction="row"
        >
            <Grid item xs={3}>
                <TaskTree />
            </Grid>
            <Grid item xs={8}>
                <Route path="/newtask">
                    <NewTaskPage />
                </Route>
                <Route path="/edittask/:taskid" component={EditTaskPage} />
            </Grid>

        </Grid>
    );
}