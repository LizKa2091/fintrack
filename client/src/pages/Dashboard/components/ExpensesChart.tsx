import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from 'recharts'
import { getCurrencySign } from '@/utils/currencySign.js'

interface ChartData {
   category: string
   amount: number
   percentage: number
}

interface ExpensesChartProps {
   data: ChartData[]
   userCurrency?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1975']

export const ExpensesChart = ({ data, userCurrency = 'RUB' }: ExpensesChartProps) => {
   if (data.length === 0) {
      return (
         <div
            style={{
               height: '240px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: 'var(--text-muted)',
            }}
         >
            Нет данных по расходам для отображения графика
         </div>
      )
   }

   const formattedData = data.map((item, index) => ({
      name: item.category,
      value: item.amount,
      fill: COLORS[index % COLORS.length],
   }))

   return (
      <div style={{ width: '100%', height: 260 }}>
         <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
               <Pie
                  data={formattedData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey='value'
               />
               <Tooltip
                  formatter={(value: unknown) => {
                     const numValue = Number(value) || 0
                     return [
                        `${numValue.toLocaleString()} ${getCurrencySign(userCurrency)}`,
                        'Сумма',
                     ]
                  }}
                  contentStyle={{
                     background: '#1e1e1e',
                     borderColor: '#333',
                     borderRadius: '8px',
                     color: '#fff',
                  }}
               />
               <Legend verticalAlign='bottom' height={36} iconType='circle' />
            </PieChart>
         </ResponsiveContainer>
      </div>
   )
}
