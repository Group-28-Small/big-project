import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { AppTheme } from 'big-project-common';

export default BottomNav = props => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'tasks', title: 'Tasks', icon: 'progress-clock' },
    { key: 'done_tasks', title: 'Done', icon: 'progress-check' },
    { key: 'sessions', title: 'History', icon: 'history' },
    // { key: 'graph', title: 'Graph', icon: 'chart-pie' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    tasks: props.TasksRoute,
    done_tasks: props.DoneRoute,
    sessions: props.HistoryRoute,
    // grah: props.GraphRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={AppTheme.secondaryColor}
      barStyle={{backgroundColor: AppTheme.primaryColor, padding: 7}}
    />
  );
};