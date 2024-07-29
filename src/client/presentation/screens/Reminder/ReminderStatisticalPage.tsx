import {CCard, CCardBody, CRow} from "@coreui/react"
import {CChart} from '@coreui/react-chartjs'

import {getStyle} from "@coreui/utils";
import {useEffect, useState} from "react";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";


const ReminderStatisticalPage = () => {

    interface formTaskData {
        labels: string[];
        incompletedTask: number[];
        completedTask: number[];
    }

    const {
        dispatchLoadStatistical,
        vmStatistical
    } = TaskListAction()
    useEffect(() => {
        dispatchLoadStatistical()
    }, []);
    const [completeTask, setCompleteTask] = useState<number[]>([]);
    const [incompleteTask, setInCompleteTask] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        console.log('vm.items', vmStatistical)
        if (vmStatistical && vmStatistical.labels) {
            setInCompleteTask(vmStatistical.inComplateTask || []);
            setLabels(vmStatistical.labels);
            setCompleteTask(vmStatistical.completeTask || []);
        }
    }, [vmStatistical]);
    //Data lấy vào theo dạng này, lấy 9 ngày để vẽ biểu đồ đường, biểu đồ cột cũng dùng chung data này ok
    //Ngày 9 là ngày hiện tại
    // 7 ngày trước đó là 7 ngày gần nhất được hiển thị ở các điểm biểu đồ 1
    // Ngày 1 là ngày ở điểm bắt đẩu của các đường line chart của biểu đồ 1
    // const taskDataRaw: formTaskData = {
    //     labels: ["04 Chủ nhật", "05 Thứ 2", "06 Thứ 3", "07 Thứ 4", "08 Thứ 5", "09 Thứ 6", "10 Thứ 7", "11 Chủ nhật", "12 Thứ 2"],
    //     incompletedTask: [2, 2, 3, 4, 0, 2, 1, 3, 6],
    //     completedTask: [4, 5, 9, 6, 7, 5, 6, 7, 1],
    // };

    const taskDataRaw = {
        labels:labels,
        incompletedTask: incompleteTask,
        completedTask: completeTask,
    };

    // Data cho biểu đồ 1
    const taskData7Day: formTaskData = {
        labels: labels,
        incompletedTask: taskDataRaw.incompletedTask,
        completedTask: taskDataRaw.completedTask,
    };

    const taskData = {
        labels: taskData7Day.labels.map(label => label && label.split(/ (.+)/)),
        incompletedTask: taskDataRaw.incompletedTask,
        completedTask: taskDataRaw.completedTask,
    };

    // Data cho biểu đồ 2
    const taskrateDataRaw = {
        labels: taskDataRaw.labels,
        completedRate: [],
        Total: [],
    };

    taskDataRaw.completedTask.forEach((completed, index) => {
        const incompleted = taskDataRaw.incompletedTask[index];
        const total = completed + incompleted;
        const completedRate = ((completed / total) * 100).toFixed(2);

        // @ts-ignore
        taskrateDataRaw.completedRate.push(completedRate);
        // @ts-ignore
        taskrateDataRaw.Total.push(100);
    });

    const taskrateData = {
        labels: taskrateDataRaw.labels.map(label => label.split(/ (.+)/)), // Split each label by the first space
        completedRate: taskrateDataRaw.completedRate,
        Total: taskrateDataRaw.Total,
    };

    // console.log(taskrateData)

    // const [minX, setMinX] = useState(taskData.labels[1]);
    // const [maxX, setMaxX] = useState(taskData.labels[taskData.labels.length - 2]);


    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <div className="py-4" style={{backgroundColor: '#F2EAE5', padding: '0', minHeight: '100vh'}}>
                <div className="h2 mx-20 font-bold"> THỐNG KÊ</div>
                <CCard className="mb-4 mx-20">
                    <CCardBody>
                        <CRow>
                            <h4 className="card-title my-4 ml-8 font-bold">
                                Nhiệm vụ hoàn thành
                            </h4>
                        </CRow>
                        <CChart className="ml-12 mr-8 mb-4"
                                title="Nhiệm vụ hoàn thành"
                                type="line"
                                data={{
                                    labels: taskData.labels,
                                    datasets: [
                                        {
                                            label: "Hoàn thành",
                                            backgroundColor: "rgba(0, 128, 0, 0)", // Transparent background
                                            borderColor: "rgba(0, 128, 0, 1)",
                                            pointBackgroundColor: "rgba(0, 128, 0, 1)",
                                            pointBorderColor: "#fff",
                                            borderWidth: 4, // Line width
                                            pointRadius: (context: { dataIndex: number; }) => (context.dataIndex === 0 || context.dataIndex === taskData.completedTask.length - 1) ? 0 : 8,
                                            pointHitRadius: 5,
                                            data: taskData.completedTask
                                        },
                                        {
                                            label: "Chưa hoàn thành",
                                            backgroundColor: "rgba(255, 165, 0, 0)", // Transparent background
                                            borderColor: "rgba(255, 165, 0, 1)",
                                            pointBackgroundColor: "rgba(255, 165, 0, 1)",
                                            pointBorderColor: "#fff",
                                            borderWidth: 4, // Line width
                                            pointRadius: (context: { dataIndex: number; }) => (context.dataIndex === 0 || context.dataIndex === taskData.completedTask.length - 1) ? 0 : 8,
                                            pointHitRadius: 5,
                                            data: taskData.incompletedTask
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false, // Hide legend
                                        },
                                        tooltip: {
                                            enabled: true,
                                            callbacks: {
                                                // title: (tooltipItems) => {
                                                //     const index = tooltipItems[0]?.dataIndex;
                                                //     if (index !== undefined) {
                                                //         const label = taskDataRaw.labels[index];
                                                //         const [part1, part2] = label.split(/ (.+)/, 2);
                                                //         return `${part2} ngày ${part1}`;
                                                //     }
                                                //     return '';
                                                // },
                                                label: (context) => {
                                                    // Customize the label (tooltip body) here
                                                    const label = context.dataset.label || '';
                                                    const value = context.parsed.y || 0;
                                                    return `${label}: ${value}`;
                                                },
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                display: false,
                                                borderWidth: 4,
                                                borderColor: "black"
                                            },
                                            // min: minX, // Set the minimum value on the x-axis
                                            // max: maxX, // Set the maximum value on the x-axis
                                            ticks: {
                                                color: getStyle('--cui-body-color'),
                                                font: {
                                                    // weight: 'bold',
                                                    size: 16,
                                                },
                                            },
                                        },
                                        y: {
                                            grid: {
                                                color: getStyle('--cui-border-color-translucent'),
                                                borderDash: [5, 5],
                                                borderWidth: 4,
                                                borderColor: "black"
                                            },
                                            ticks: {
                                                color: getStyle('--cui-body-color'),
                                                font: {
                                                    // weight: 'bold',
                                                    size: 16,
                                                },
                                            },
                                        },
                                    },
                                }}
                        />
                    </CCardBody>
                </CCard>

                {/* Biểu đồ tiếp theo */}

                <CCard className="mx-20">
                    <CRow>
                        <h4 className="card-title my-4 ml-8 font-bold ">
                            Tỷ lệ hoàn thành
                        </h4>
                    </CRow>
                    <CChart className="ml-12 mr-8 "
                            title="Tỷ lệ hoàn thành"
                            type="bar"
                            data={{
                                labels: taskrateData.labels,
                                datasets: [
                                    {
                                        label: 'Completed Rate',
                                        backgroundColor: 'rgba(88,88,254,255)', // Dark blue color for dataset
                                        borderColor: 'rgba(142, 188, 255, 1)',
                                        borderWidth: 1,
                                        // hoverBackgroundColor: 'rgba(142, 188, 255, 0.7)',
                                        data: taskrateData.completedRate,
                                        barThickness: 10, // Độ rộng của thanh bar
                                        maxBarThickness: 50, // Độ rộng tối đa của thanh bar
                                    },
                                    {
                                        label: 'Total',
                                        backgroundColor: 'rgba(233,235,238,255)', // Dark gray color for the total
                                        borderColor: 'rgba(0, 0, 0, 1)',
                                        borderWidth: 1,
                                        // hoverBackgroundColor: 'rgba(0, 0, 0, 0.9)',
                                        data: taskrateData.Total,
                                        barThickness: 10, // Độ rộng của thanh bar
                                        maxBarThickness: 50, // Độ rộng tối đa của thanh bar
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const datasetLabel = context.dataset.label || '';
                                                const value = context.parsed.y.toFixed(2);

                                                // Show label and value only for "Completed Rate" dataset
                                                if (datasetLabel === 'Completed Rate') {
                                                    if(value==='NaN')
                                                    {
                                                        return  [`0%`]
                                                    }
                                                    return [`${value}%`];  // Wrap the string in an array
                                                }
                                                return []
                                                // For other datasets (e.g., "Total"), return an empty array

                                            },

                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        stacked: true, // Enable stacking on x-axis
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                            borderDash: [5, 5],
                                        },
                                        ticks: {
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            stepSize: 20,
                                            font: {
                                                size: 16,
                                            }
                                        },
                                    },
                                    y: {
                                        display: true,
                                        ticks: {
                                            font: {
                                                size: 16,
                                            }
                                        }
                                    },
                                },
                                indexAxis: 'x', // Change to 'x' for vertical stackbar
                                // maintainAspectRatio: false,
                                responsive: true, // Make the chart responsive
                                // aspectRatio: 2, // Adjust aspect ratio for height
                                // height: 300,
                            }}
                    />
                </CCard>


            </div>
        </>
    )
}
export default ReminderStatisticalPage