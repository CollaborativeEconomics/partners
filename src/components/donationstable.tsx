import React, { HTMLProps } from 'react';
import styles from "~/components/dashboard.module.css"

type Dictionary = { [key:string]:any }

interface TableProps {
  data?: Dictionary;
}

function toLocale(sdate: string){
  return (new Date(sdate)).toJSON().substr(0,16).replace('T',' ')
}

const DonationsTable = ({ data }: TableProps) => {
  const count = data?.length || 0
  let total = 0
  for(const i in data){ total += parseFloat(data[i].usdValue) }
  //console.log('DATA', data)
  console.log('Count', count)
  console.log('Total', total)

  return (
    <table className={styles.reportList}>
      <thead>
        <tr><th>Date</th><th>Wallet</th><th>Amount USD</th></tr>
      </thead>
      <tbody>
        {data?.length ? 
          data.map((item: Dictionary) => (
            <tr key={item.id}>
              <td>{toLocale(item.created)}</td>
              <td>{item.donorAddress}</td>
              <td>{item.usdValue}</td>
            </tr>
          ))
        : <tr><td colSpan={3} className="py-6">No donations received</td></tr>
        }
      </tbody>
      <tfoot>
        <tr><td colSpan={3}>Total received in {count} donations USD {total.toFixed(4)}</td></tr>
      </tfoot>
    </table>
  )
}

export default DonationsTable;
