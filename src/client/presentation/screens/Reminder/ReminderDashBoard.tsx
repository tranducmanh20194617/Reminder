import {CCard} from "@coreui/react"
import {Button, DatePicker, DatePickerProps, notification} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {ArrowLeftOutlined, ArrowRightOutlined, MailOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";

import dayjs from 'dayjs';
import 'dayjs/locale/en'; // import the locale if needed
import 'dayjs/locale/vi'; // import the locale if needed
import 'dayjs/locale/fr'; // import the locale if needed
import 'dayjs/locale/ja'; // import
import {TaskModel} from "../../../models/ReminderModel";
import Function from "../../../const/Function";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";

import {debounce} from "lodash";

const ReminderDashBoard = () => {
    const {
        dateTimeChangeToThu,
        ChangeTime
    } = Function()
    const {
        dispatchEditTask,
        dispatchLoadTask,
        vm: vmListTask
    } = TaskListAction()
    const currentDate = new Date();
    const initialDate = currentDate.getDate();
    const [timeNow, setTimeNow] = useState<Date>(new Date());
    const debouncedUpdateTasks = useCallback(
        debounce((tasks) => {
            tasks.forEach((task) => {
                if (task.miniTask) {
                    const updatedMiniTasks = task.miniTask.map((miniTask) => {
                        if (miniTask.status === 0) {
                            return {
                                ...miniTask,
                                status: 2,
                            };
                        }
                        return miniTask;
                    });

                    const updatedTask = {
                        ...task,
                        miniTask: updatedMiniTasks,
                    };

                    dispatchEditTask(updatedTask.id, updatedTask);
                }
            });
        }, 200),
        []
    );
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navigate = useNavigate()
    const [current, setCurrent] = useState<number>(initialDate > 20 ? 20 : initialDate);
    const [selectedButton, setSelectedButton] = useState<number | null>(initialDate > 20 ? 20 : initialDate);
    const [start, setStart] = useState<number>(initialDate > 20 ? 20 : initialDate);
    const [month, setMonth] = useState<string>(dayjs().startOf('month').format('MM/YYYY'));
    const [count, setCount] = useState(0)
    const [totalDaysInMonth, setTotalDaysInMonth] = useState(dayjs().daysInMonth()); // Initialize with current month's days
    const [taskList, setTaskList] = useState<TaskModel[]>()
    const [taskListCheck, setTaskListCheck] = useState<TaskModel[]>([])
    const [taskListCurrent, setTaskListCurrent] = useState<TaskModel[]>()
    const [completedTasks, setCompletedTasks] = useState<TaskModel[]>([])

    const customMonthYearFormat: DatePickerProps['format'] = (value) =>
        `THÁNG ${dayjs(value).locale('vi').format('M')} NĂM ${dayjs(value).format('YYYY')}`;
    useEffect(() => {
        const currentDateTime = new Date();
        dispatchLoadTask()
        setTimeNow(currentDateTime)
    }, []);
    useEffect(() => {
        console.log('vm.isLoading', vmListTask.isLoading)
    }, [vmListTask.isLoading])

    useEffect(() => {
        console.log('vm.items', vmListTask.items)
        if(vmListTask.isLoading===4)
        {
            setTaskListCheck(vmListTask.items)

        }
    }, [vmListTask.items])

    useEffect(() => {
        // Lọc và cập nhật state tương ứng

        const filteredCompleted = taskListCheck.filter((task) => {
            const startedAt = task.startedAt ? new Date(task.startedAt) : null;
            const expiredAt = task.expiredAt ?  new Date(task.expiredAt)  : null;
            return expiredAt && expiredAt < timeNow && !(startedAt && startedAt > timeNow);
        });

        setCompletedTasks(filteredCompleted);
    }, [taskListCheck]);
    useEffect(() => {
        if (completedTasks.length !== 0) {
            console.log(completedTasks)
            debouncedUpdateTasks(completedTasks);
        }
    }, [completedTasks]);
    useEffect(() => {
        const filteredTaskList = vmListTask.items?.filter(task => {
            const startedAt = dayjs(task.startedAt);
            return startedAt.isSame(dayjs(month, 'MM/YYYY'), 'month');
        });
        setTaskList(filteredTaskList);
    }, [month, vmListTask.items]);

    useEffect(() => {
        if (count === 1) {
            if (taskList?.length === 0) {
                notification.error({
                    message: 'Không có công việc trong Tháng này!!',
                    duration: 1,
                });
            } else {
                notification.success({
                    message: 'Lấy danh sách công việc thành công!!',
                    duration: 1,
                });
            }

        }
    }, [taskList]);
    useEffect(() => {
        const filteredList = taskList?.filter((item) => {
            // Only render tasks with priority equal to current
            return dateTimeChangeToThu(item.startedAt) === current;
        });

        setTaskListCurrent(filteredList);
    }, [current, taskList]);

    const handleNumChange = (number: number) => {
        const startIndex = start;
        const endIndex = startIndex + 6;

        if (number >= startIndex && number <= endIndex && current !== number) {
            setCurrent(number);
            setSelectedButton(number);
            console.log(number)
        }
    };

    const handleArrowRightClick = () => {
        const newStart = Math.min(start + 7, totalDaysInMonth - 6);
        setStart(newStart);
        setCurrent(newStart);
        setSelectedButton(newStart);
    };

    const handleArrowLeftClick = () => {
        const newStart = Math.max(start - 7, 1);
        setStart(newStart);
        setCurrent(newStart);
        setSelectedButton(newStart);
    };

    const onChange: DatePickerProps['onChange'] = (value) => {
        if (value !== null) {
            const selectedMonth = dayjs(value).startOf('month');
            setMonth(selectedMonth.format('MM/YYYY'));
            setTotalDaysInMonth(selectedMonth.daysInMonth()); // Update total days
            console.log("tháng: ", month)
            setCount(1)
            setCurrent(initialDate > 20 ? 20 : initialDate)
            setSelectedButton(initialDate > 20 ? 20 : initialDate)
            setStart(initialDate > 20 ? 20 : initialDate)
        }
    };
    const onClickTaskDetail = (id: string | undefined) => {
        console.log(id)
        navigate(`/taskDetail/${id}`)
    }
    return (
        <>
            <CCard className="mb-4">
                <div style={{backgroundColor: '#F2EAE5', padding: '0', minHeight: '100vh', marginBottom: '-20px'}}>
                    <div
                        style={{
                            marginTop: '10px',
                            marginBottom: '10px',
                            maxWidth: 1200,
                            paddingLeft: '3vw',
                            paddingRight: '3vw',
                            display: 'flex',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: '23px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%', // Fill the available width
                                marginBottom: '10px'
                            }}
                        >
                            <DatePicker defaultValue={dayjs()} onChange={onChange} picker="month" format={customMonthYearFormat}/>

                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            maxWidth: 1250,
                            paddingLeft: "3vw",
                            paddingRight: "3vw",
                            display: "flex",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "23px",
                            justifyContent: "space-between",
                        }}
                    >
                        <ArrowLeftOutlined
                            style={{fontSize: "30px"}}
                            onClick={handleArrowLeftClick}
                            disabled={start === 1}
                        />
                        <div
                            style={{
                                marginLeft: "30px",
                                paddingLeft: "20px",
                                display: "flex",
                                width: 1250,
                                overflowX: "auto",
                            }}
                        >
                            {[...Array(7)].map((_, index) => (
                                <Button
                                    key={index + start}
                                    onClick={() => handleNumChange(index + start)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        marginRight: "90px",
                                        backgroundColor:
                                            selectedButton === index + start ? "#FED36A" : "white",
                                        border:
                                            selectedButton === index + start
                                                ? "1px solid black"
                                                : "1px solid transparent",
                                        color: "black",
                                    }}
                                >
                                    <span style={{fontWeight: "bold"}}>{index + start}</span>
                                </Button>
                            ))}
                        </div>
                        <ArrowRightOutlined
                            style={{fontSize: "30px", marginLeft: "10px"}}
                            onClick={handleArrowRightClick}
                            disabled={current + 6 >= totalDaysInMonth}
                        />
                    </div>
                    <div
                        style={{
                            marginTop: '10px',
                            maxWidth: 1200,
                            paddingLeft: '5vw',
                            paddingRight: '5vw',
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: '23px',
                        }}
                    >


                        <b>Công việc</b>
                        {taskListCurrent?.length === 0 ? (
                                <div style={{textAlign: "center", fontSize: "18px", marginTop: "20px"}}>
                                    Không có nhiệm vụ trong ngày này
                                </div>
                            ) :
                            (taskListCurrent?.map((item, index) => {
                                // Only render tasks with priority equal to current
                                return (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <div
                                            style={{
                                                color: hoveredIndex === index ? "black" : 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '2px solid #E5DFDD',
                                                borderRadius: '8px',
                                                margin: '5px 0',
                                                paddingTop: '15px',
                                                paddingBottom: '15px',
                                                background: hoveredIndex === index ? "#FED36A" : `linear-gradient(to right, #FED36A 20px, #263238 20px, #263238 100%)`,

                                            }}
                                        >
                                            <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                                                <div style={{marginRight: '50px', display: 'flex', alignItems: 'center', width: "200px"}}>
                                                    <div>
                                                        <MailOutlined
                                                            style={{
                                                                color: hoveredIndex === index ? "black" : '#FED36A', fontSize: 41,
                                                                width: '41px',
                                                                height: '41px',
                                                                marginLeft: '40px',
                                                            }}
                                                        />
                                                    </div>
                                                    <span style={{
                                                        marginLeft: '10px',
                                                        color: hoveredIndex === index ? "black" : '#FED36A',
                                                        fontWeight: 'bold',
                                                        fontSize: 20
                                                    }}
                                                    >
                                              {item.tag}
                                            </span>
                                                </div>

                                                <div style={{textAlign: 'left'}}>
                                                    <div>
                                                        <div style={{alignItems: 'center'}}>
                                                            <div style={{flex: 1, textAlign: 'left'}}>
                                                                <b>
                                              <span style={{display: 'flex', alignItems: 'center', fontSize: '18px'}}>
                                                {item.name}
                                              </span>
                                                                </b>
                                                                <div style={{marginTop: '5px', fontSize: '12px'}}>
                                                                    {ChangeTime(item.startedAt)}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <div style={{marginTop: '10px', width: '100px', fontSize: '15px'}}>
                                                    <Button
                                                        onClick={() => onClickTaskDetail(item.id)}
                                                        style={{borderRadius: 20, backgroundColor: "#224A35", color: '#1A902E'}}>View</Button>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                );

                                // Skip rendering for tasks with different priority
                            }))}
                    </div>
                </div>
            </CCard>
        </>
    )
}
export default ReminderDashBoard