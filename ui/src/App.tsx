import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BoolTypeHabits, Habit, HabitIds, HabitLabels, Habits, NumberTypeHabits } from './Constants';
import axios from 'axios';
import { HabitLog, HabitValue } from './Types';
import { Button, Checkbox, Paper, Stack, Table, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';

const AppWrapper = styled(Paper)(() => ({
  padding: "20px"
}))

function App() {
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [habitValues, setHabitValues] = useState<{[ key: number ]: string | boolean }>({});
  const [isListLoading, setIsListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const loadHabitLogs = async () => {
    setIsListLoading(true);
    try {
      const habitsLogsRes = await axios.get<HabitLog[]>("/habitlogs/list");
      setHabitLogs(habitsLogsRes.data as HabitLog[]);
      if (habitsLogsRes.data?.length) {
        const todaysDate = new Date().toDateString();
        const currentHabitLog = habitsLogsRes.data.find((habitLog) => {
          const habitLogDate = new Date(habitLog.CreatedDateTime?.split("T")[0] || "").toDateString();
          return habitLogDate === todaysDate;
        });
        const defaultHabitValues: { [ key: number ]: string | boolean } = {};
        NumberTypeHabits.forEach(habit => {
          defaultHabitValues[habit] = "";
        });
        BoolTypeHabits.forEach(habit => {
          defaultHabitValues[habit] = false;
        })
        if (currentHabitLog) {
          const habitValues = currentHabitLog.HabitValues;
          Habits.forEach(habit => {
            const habitValue = habitValues.find((habitValue) => habitValue.Id === habit);
            if (NumberTypeHabits.includes(habit)) {
              defaultHabitValues[habit] = habitValue?.Value || ""
            } else {
              defaultHabitValues[habit] = habitValue?.Value === "true" || false
            }
          })
        }
        setHabitValues(defaultHabitValues);
      }
    } catch {
      // Handle error
    } finally {
      setIsListLoading(false);
    }

  }
  useEffect(() => {
    loadHabitLogs()
  }, [])

  const formatFormValuesToHabits = () => {
    const habits: HabitValue[] = [];
    Object.keys(habitValues).forEach((habit) => {
      habits.push({
        Id: parseInt(habit),
        Value: habitValues[parseInt(habit)].toString()
      })
    })
    return habits;
  }
  
  const onSaveClick = async () => {
    setSaving(true);
    const habitValues = formatFormValuesToHabits()
    try {
      await axios.put("/habitlogs/update", {
        HabitValues: habitValues
      })
    } catch {

    } finally {
      setSaving(false);
    }
  }

  const renderHabitInputs = () => {
    const numberTypeHabits = NumberTypeHabits.map((habit) => {
        return <TextField
          label={ HabitLabels[habit] }
          value={ habitValues[habit] }
          onChange={(e) => setHabitValues({...habitValues, [habit]: e.target.value }) }
        />
      })
    const boolTypeHabits = BoolTypeHabits.map((habit) => {
      return <div style={ { display: "flex", gap: "20px", alignItems: "center" } }><Checkbox
        checked={ habitValues[habit] as boolean }
        onChange={ (e) => setHabitValues({...habitValues, [habit]: e.target.checked })}
      />
      <Typography variant="body1">{ HabitLabels[habit] }</Typography>
    </div>
    })
    return <>
      { numberTypeHabits }
      { boolTypeHabits } 
    </>

  }

  const renderSaveButton = () => {
    return <Button onClick={ onSaveClick } disabled={ saving }>
      Save
    </Button>
  }

  const renderHabitLogsTable = () => {
    return null;
  }

  return (
    <AppWrapper className="App">
      <Stack spacing={ 2 }>
      {isListLoading ? "Loading..." : <>
        { renderHabitInputs() }
        { renderSaveButton() }
        { renderHabitLogsTable() }
      </> }
    </Stack>
  </AppWrapper>);
}

export default App;
