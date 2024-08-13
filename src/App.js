import './App.css';
import React, { useEffect, useState } from 'react';
import { Scheduler, DayView, WeekView, MonthView, Appointments, AppointmentForm, AppointmentTooltip, Toolbar, DateNavigator, ViewSwitcher } from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from './firebase'; 

function App() {
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState('2024-08-12');
  const [currentViewName, setCurrentViewName] = useState('Day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const events = querySnapshot.docs.map(doc => {
          const eventData = doc.data();
          // dodatkowo sprawdzanie czy startDate i endDate są Timestampami
          const startDate = eventData.startDate instanceof Date ? eventData.startDate : eventData.startDate.toDate ? eventData.startDate.toDate() : new Date(eventData.startDate);
          const endDate = eventData.endDate instanceof Date ? eventData.endDate : eventData.endDate.toDate ? eventData.endDate.toDate() : new Date(eventData.endDate);

          return {
            id: doc.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            title: eventData.title,
            allDay: eventData.allDay || false,
          };
        });

        console.log("Fetched events:", events);
        setData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  const addEvent = async (event) => {
    try {
      const eventToSave = {
        ...event,
        startDate: new Date(event.startDate), 
        endDate: new Date(event.endDate), 
      };
      const docRef = await addDoc(collection(db, "events"), eventToSave);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    let updatedData = data;

    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      const newEvent = { id: startingAddedId, ...added };
      await addEvent(newEvent); // Zapis do Firestore
      updatedData = [...updatedData, newEvent];
    }
  
    if (changed) {
      updatedData = await Promise.all(updatedData.map(async (appointment) => {
        if (changed[appointment.id]) {
          const updatedAppointment = { ...appointment, ...changed[appointment.id] };
          await updateDoc(doc(db, "events", appointment.id), updatedAppointment); 
          return updatedAppointment;
        }
        return appointment;
      }));
    }
  
    if (deleted !== undefined) {
      const appointmentToDelete = updatedData.find(appointment => appointment.id === deleted);
      if (appointmentToDelete) {
        await deleteDoc(doc(db, "events", appointmentToDelete.id)); // Usunięcie z Firestore
        updatedData = updatedData.filter(appointment => appointment.id !== deleted);
      }
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
      <DayView startDayHour={0} endDayHour={24} />
      <WeekView startDayHour={0} endDayHour={24} />
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