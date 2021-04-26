import { AppBar, Box, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import { AccessTime, List, PieChart } from "@material-ui/icons";
import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import SessionHistory from "./SessionHistory";
import Sunburst from "./Sunburst";
import TaskTree from "./TaskTree";
export function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box p={3}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));
  
export function Home() {
const classes = useStyles();
const [value, setValue] = React.useState(0);

const handleChange = (event, newValue) => {
    setValue(newValue);
};

    return (
        <div className={classes.root}>
        <AppBar position="static" color="default">
            <Tabs
            value={value}
            onChange={handleChange}
            variant="fullwidth"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
            centered
            >
            <Tab label="Tasks" icon={<List />} {...a11yProps(0)} />
            <Tab label="Chart" icon={<PieChart />} {...a11yProps(1)} />
            <Tab label="History" icon={<AccessTime />} {...a11yProps(2)} />
            </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} >
            <TaskTree /> 
        </TabPanel>
            <TabPanel value={value} index={1} >
                <Sunburst />
        </TabPanel>
        <TabPanel value={value} index={2} >
            <Route exact path="/">
                <SessionHistory />
            </Route>
        </TabPanel>
        </div>
    )
}