"use client"
import React, { HTMLProps } from 'react';
import styles from "~/components/dashboard.module.css"

interface TimeTabProps {
  className?: string;
  byYear?: () => boolean;
  byMonth?: () => boolean;
  byWeek?: () => boolean;
  selected?: number;
}

const TimeTab = ({
  className,
  byYear,
  byMonth,
  byWeek,
  selected,
  ...rest
}: TimeTabProps & HTMLProps<HTMLDivElement>) => {
  function deselect() {
    document.getElementById('timeYear')?.classList.remove('selected')
    document.getElementById('timeMonth')?.classList.remove('selected')
    document.getElementById('timeWeek')?.classList.remove('selected')
  }

  function select(n: number) {
    switch(n){
      case 0: document.getElementById('timeYear')?.classList.add('selected'); break;
      case 1: document.getElementById('timeMonth')?.classList.add('selected'); break;
      case 2: document.getElementById('timeWeek')?.classList.add('selected'); break;
    }
  }

  function onYear() {
    console.log('onYear')
    deselect()
    select(0)
    //byYear()
  }

  function onMonth() {
    console.log('onMonth')
    deselect()
    select(1)
    //byMonth()
  }

  function onWeek() {
    console.log('onWeek')
    deselect()
    select(2)
    //byWeek()
  }

  return (
    <div className={styles.timeTab}>
      <button id="timeYear"  className={styles.buttonTime + ' selected'} onClick={onYear}>Year</button>
      <button id="timeMonth" className={styles.buttonTime} onClick={onMonth}>Month</button>
      <button id="timeWeek"  className={styles.buttonTime} onClick={onWeek}>Week</button>
    </div>
  )
}

export default TimeTab;
