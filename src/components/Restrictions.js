import React, { useState } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import '../App.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

//criar botao de salvar, salvar no banco
//mostrar prof azul ?
//os dias do prof nao estao mostrando
//card do horário selecionado não muda de cor
//blocos de horário não muda de cor
//mostrar somente 1 ano por vezes
//deixar cinza os dias anteriores ao atual

moment.locale('pt-br');//traduzir selectedDate


//COMPONENTES 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//botao hoje
const TodayButton = styled.button` 
margin: 10px; 
padding: 10px; 
background-color: black; 
color: white; 
border: none; 
border-radius: 5px; 
cursor: pointer;
`;

//card do horário selecionado
const Card = styled.div`
  width: 200px;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  background-color: ${props => (props.conflict ? 'red' : 'green')};
  color: white;
  text-align: center;
  position: relative;
`;

//remover botão x
const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
`;

//agrupamento dos blocos de horário
const TimeSlot = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
`;

//blocos de horário
const TimeButton = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: ${props => (props.selected ? 'green' : props.red ? 'red' : props.professor ? 'blue' : 'gray')};
  color: white;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  &:hover {
    background-color: ${props => (props.selected ? 'darkgreen' : props.red ? 'darkred' : props.professor ? 'darkblue' : 'darkgray')};
  }
`;

//RESTRIÇÕES
const generateProfessorRestrictions = () => {
  const restrictions = [];
  const currentYear = new Date().getFullYear();
  // const currentMonth = new Date().getMonth();
  // const currentDay = new Date().getDay();
  // const startDate = new Date(currentYear, currentMonth, currentDay);
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const day = date.getDay();
    if (day === 1 || day === 2) { // Monday or Tuesday
      for (let hour = 7; hour <= 19; hour++) {
        restrictions.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0));
        restrictions.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 30));
      }
    } else if (day === 3 || day === 4) { // Wednesday or Thursday
      for (let hour = 7; hour <= 17; hour++) {
        restrictions.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0));
        restrictions.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 30));
      }
    }
    // No restrictions for Friday (day === 5)
  }

  return restrictions;
};

const professorRestrictions = generateProfessorRestrictions();


const Restrictions = ({ professorRestrictions = [] }) => {
  const [studentAvailability, setStudentAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate ? moment(selectedDate).format('DD [de] MMMM [de] YYYY') : '';
  const [view, setView] = useState('month'); // Adiciona o estado da visão
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear, 0, 1);
  const maxDate = new Date(currentYear, 11, 31);
  const today = new Date();

  const isProfessorRestriction = (dateTime) => {
    return professorRestrictions.some(restriction => restriction.getTime() === dateTime.getTime());
  };

  //HANDLE'S
  const handleDateChange = (date) => {
    setSelectedDate(date); 
  };

  //na visao de anos está indo para 01/01/2021
  const handleTodayClick = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth(); 
    const todayMonth = today.getMonth();

     if (view === 'month' && currentMonth !== todayMonth) {
      setSelectedDate(today);
      setView('month'); // Muda a visão para o mês
    }
    else {
      setSelectedDate(today);
      setView('month');
    }
  };

  const handleTimeSelect = (time) => {
    const dateTime = new Date(selectedDate);
    dateTime.setHours(time.hours, time.minutes, 0, 0);

    const dateKey = selectedDate.toDateString(); 
    const selectedTimesForDate = studentAvailability[dateKey] || [];

    if (!selectedTimesForDate.some(t => t.getTime() === dateTime.getTime())) {
      setStudentAvailability({
        ...studentAvailability,
        [dateKey]: [...selectedTimesForDate, dateTime]
      });
    } else {
      setStudentAvailability({
        ...studentAvailability,
        [dateKey]: selectedTimesForDate.filter(t => t.getTime() !== dateTime.getTime())
      });
    }
  };

  //FUNCTIONS
  const checkConflict = (dateTime) => {
    return professorRestrictions.some(restriction => restriction.getTime() === dateTime.getTime());
  };

  const removeDateTime = (dateTimeToRemove) => {
    const dateKey = dateTimeToRemove.toDateString();
    setStudentAvailability({
      ...studentAvailability,
      [dateKey]: studentAvailability[dateKey].filter(dateTime => dateTime.getTime() !== dateTimeToRemove.getTime())
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 19; hour++) {
      slots.push({ hours: hour, minutes: 0 });
      if (hour !== 19) { 
        slots.push({ hours: hour, minutes: 30 }); 
      } 
    } 
    return slots; 
  };

//DOM - HTML
  return (
    <Container>
      <h2>Selecione suas indisponibilidades</h2>
      <TodayButton onClick={handleTodayClick}>Hoje</TodayButton>
      <Calendar onClickDay={handleDateChange}
      value={selectedDate} 
      view={view} // Define a visão atual 
      onActiveStartDateChange={({ activeStartDate, view }) => setView(view)} // Atualiza a visão ao mudar
      tileClassName={({ date, view }) => {
        const day = date.getDay();
          if (view === 'month') {
            
            if (date < today) {  //dias anteriores que hoje sao desativados
              return 'react-calendar__tile--disabled'; 
            }
            if (day === 0 || day === 6) {//deixando cinza sabado e domingo e removendo
              return 'react-calendar__tile--weekend';
            }
            // if (day >= 1 && day <= 5) { // Dias da semana (segunda a sexta-feira) 
            //   return 'react-calendar__tile--weekday'; 
            // }

            if (professorRestrictions.some(restriction => restriction.getTime() === date.getTime())) {
              return 'react-calendar__tile--professor-restriction';
             }
             if (moment(date).isSame(new Date(), 'day')) {
              return 'react-calendar__tile--today';
            } 
             return null;
          }
        }}
        tileDisabled={({ date, view }) => view === 'month' && date < today && (date.getDay() === 0 || date.getDay() === 6)}//desativando sabado e domingo
        minDate={minDate}
        maxDate={maxDate}
        showNeighboringMonth = {false}
        showWeekNumbers = {false}
        locale = {'pt-BR'}
      />
      {selectedDate && (
        <>
          <h3>Selecione os horários para {formattedDate}</h3>
          <TimeSlot>
            {generateTimeSlots().map((time, index) => {
              const dateTime = new Date(selectedDate);
              dateTime.setHours(time.hours, time.minutes, 0, 0);
              const dateKey = selectedDate.toDateString();
              const selectedTimesForDate = studentAvailability[dateKey] || [];
              return (
                <TimeButton
                  key={index}
                  selected={selectedTimesForDate.some(t => t.getHours() === time.hours && t.getMinutes() === time.minutes)}
                  red={time.hours === 12 && time.minutes === 0}
                  professor={isProfessorRestriction(dateTime)}
                  onClick={() => handleTimeSelect(time)}
                >
                  {`${time.hours}:${time.minutes === 0 ? '00' : time.minutes}`}
                </TimeButton>
              );
            })}
          </TimeSlot>

        </>
      )}
      <h2>Suas Indisponibilidades</h2>
    
    {Object.keys(studentAvailability).map(dateKey => ( 
      studentAvailability[dateKey].map((dateTime, index) => ( 
      <Card key={index} conflict={checkConflict(dateTime)}> 
      {dateTime.toLocaleString()} 
      <RemoveButton onClick={() => removeDateTime(dateTime)}>X</RemoveButton> 
      </Card> 
      )) 
    ))} 
    </Container>
  );
};

export default Restrictions;