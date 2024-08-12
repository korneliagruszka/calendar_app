import './App.css';
import React, { useState } from 'react';
import { Scheduler, DayView, WeekView, MonthView, Appointments, AppointmentForm, AppointmentTooltip, Toolbar, DateNavigator, ViewSwitcher } from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';

const schedulerData = [
  { id: 0, startDate: '2024-08-12T09:45', endDate: '2024-08-12T11:00', title: 'Meeting' },
];

function App() {
  const [data, setData] = useState(schedulerData);
  const [currentDate, setCurrentDate] = useState('2024-08-12');
  const [currentViewName, setCurrentViewName] = useState('Day');

  const commitChanges = ({ added, changed, deleted }) => {
    let updatedData = data;
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      updatedData = [...data, { id: startingAddedId, ...added }];
    }

    if (changed) {
      updatedData = data.map(appointment =>
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
      );
    }

    if (deleted !== undefined) {
      updatedData = data.filter(appointment => appointment.id !== deleted);
    }
    setData(updatedData);
  };

  return (
    <Scheduler data={data}>
      <ViewState
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        currentViewName={currentViewName}
        onCurrentViewNameChange={setCurrentViewName}
      />
      <EditingState onCommitChanges={commitChanges} />
      <IntegratedEditing />
      <DayView startDayHour={9} endDayHour={14} />
      <WeekView startDayHour={9} endDayHour={14} />
      <MonthView />
      <Toolbar />
      <DateNavigator />
      <ViewSwitcher />
      <Appointments />
      <AppointmentTooltip showOpenButton showDeleteButton />
      <AppointmentForm />
    </Scheduler>
  );
}

export default App;