"use client" 
import dynamic from "next/dynamic"; 
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { Spinner } from "@telegram-apps/telegram-ui";
import { PriceDto } from "@/lib/Types";
import { VisibleSpinner } from "@/components/VisibleSpinner/VisibleSpinner";
import './styles.css';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const LineChart = ({ chartData }: { chartData?: PriceDto[] }) => {
    const [chartOptions, setChartOptions] = useState({} as ApexOptions);

    useEffect(() => {
      if(!chartData) { return }
        setChartOptions({
            series: [{
                name: "Price",
                data: chartData,
                color: "var(--portfolio-primary-green)"
            }],
            chart: {
                type: 'line',
                stacked: false,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: false
                },
                selection: {
                    enabled: true
                }
            },
            legend: {
                show: true
            },
            stroke: {
                curve: 'smooth',
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
            },
            grid: {
                show: false
            },
            yaxis: {
                labels: {
                    show: true,
                    style: {
                        colors: 'var(--tg-theme-text-color)'
                    }
                },
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    show: true,
                    style: {
                        colors: 'var(--tg-theme-text-color)',
                        fontSize: "12px"
                    }
                },
            },
        });
      }, [chartData]);

    if(!chartData || !chartOptions || !chartOptions.series) {
        return (
            <div className="line-chart-spinner">
                <VisibleSpinner containerType="flex" />
            </div>
        );
    }
    
    return (
        <div className="line-chart">
            <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="line"
                height={180}
                width='100%'
            />
        </div>
    )
}