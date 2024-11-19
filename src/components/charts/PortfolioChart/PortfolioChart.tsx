'use client'
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SegmentedControl } from "@telegram-apps/telegram-ui";
import { LineChart, FetchError, Controls } from "@/components";
import { ApiGetBalanceHistory } from "@/lib/ApiManager";
import { useSession, useControls } from "@/hooks";
import { numberToStringWithSymbol } from "@/lib/Utils";
import { IControl } from "@/lib/Types";
import './styles.css'

export const PortfolioChart = () => {
    const queryClient = useQueryClient();
    const {accessToken, phrases, dataType} = useSession();
    const {periods} = useControls(phrases);

    const [totalBalance, setTotalBalance] = useState<string>();
    const [deltaBalance, setDeltaBalance] = useState<string>();
    const [deltaBalanceNumber, setDeltaBalanceNumber] = useState<number>();

    const [chartPeriod, setChartPeriod] = useState<IControl>(periods.week);
  
    const fetchAction = async () => {
        if(!accessToken) { return }
        if(dataType !== "demo" && dataType !== "user") { return }
        return await ApiGetBalanceHistory(accessToken, dataType, chartPeriod.code)
    }
  
    const { data: balanceHistory, error } = useQuery({
        queryKey: ['balanceHistory', chartPeriod.code],
        queryFn: fetchAction,
        enabled: Boolean(accessToken)
    });

    useEffect(() => {
        if(!balanceHistory || balanceHistory.length === 0) { return }

        setTotalBalance(
            numberToStringWithSymbol(balanceHistory[0].y,"$",2,false)
        );
        const delta = (Number(balanceHistory[0].y) - Number(balanceHistory[balanceHistory.length-1].y)) 
            / Number(balanceHistory[balanceHistory.length-1].y) * 100;
        setDeltaBalance(
            numberToStringWithSymbol(delta,"percent",2,true)
        );
        setDeltaBalanceNumber(delta);

    }, [balanceHistory]);
  
    if(error) {
        return (
            <div className="portfolio-chart">
                <FetchError
                    phrases={phrases}
                    containerType="flex"
                    refreshAction={() => queryClient.resetQueries({ queryKey: ['balanceHistory'] }) } 
                />
            </div>
        );
    }

    return (
        <div className="portfolio-chart-container">
            <div className={
                deltaBalanceNumber 
                ?
                    deltaBalanceNumber > 0 ? "portfolio-chart-balance portfolio-chart-balance-green" : "portfolio-chart-balance portfolio-chart-balance-red"
                :
                "portfolio-chart-balance"
            }>
                {
                    balanceHistory && balanceHistory.length > 0 &&
                        <>
                            <div className="portfolio-chart-balance-row">
                                {totalBalance}
                            </div>
                            <div className="portfolio-chart-balance-row">
                                {deltaBalance}
                            </div>
                        </>
                }
            </div>
            <div className="portfolio-chart-chart">
                <LineChart chartData={balanceHistory} />
            </div>
            
            <div className="portfolio-chart-controls-container">
                <Controls
                    controlsList={periods}
                    currentControl={chartPeriod}
                    onSelect={period => setChartPeriod(period)}
                />
            </div>
        </div>
        
    );
}