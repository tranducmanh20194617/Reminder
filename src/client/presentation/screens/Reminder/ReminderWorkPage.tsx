import React, {useEffect, useState} from 'react';
import {Card, Col, Row, Tag} from 'antd';
import {CCard} from '@coreui/react';
import Function from "../../../const/Function";
import {CalendarOutlined} from "@ant-design/icons";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";
import {TaskModel} from "../../../models/ReminderModel";
import {useNavigate} from "react-router";


const ReminderWorkPage = () => {
    const {
        setTagColor,
        ChangeTimeHour,
        setPriorityText,
        setColorMiniTaskText
    } = Function()
    const navigate = useNavigate()
    const [timeNow, setTimeNow] = useState<Date>(new Date());
    const [taskList, setTaskList] = useState<TaskModel[]>([])
    const [ongoingTasks, setOngoingTasks] = useState<TaskModel[]>([])
    const [upcomingTasks, setUpcomingTasks] = useState<TaskModel[]>([])
    const [completedTasks, setCompletedTasks] = useState<TaskModel[]>([])
    const {
        dispatchLoadTask,

        vm: vmListTask
    } = TaskListAction()
    useEffect(() => {
        dispatchLoadTask()
        const currentDateTime = new Date();
        // console.log(currentDateTime)
        console.log(currentDateTime.getTime())
        setTimeNow(currentDateTime)
    }, []);
    useEffect(() => {
        console.log('vm.isLoading', vmListTask.isLoading)
    }, [vmListTask.isLoading])

    useEffect(() => {
        console.log('vm.items', vmListTask.items)
        setTaskList(vmListTask.items)
    }, [vmListTask.items])
    useEffect(() => {
        // Lọc và cập nhật state tương ứng
        const filteredUpcoming = taskList.filter((task) => {
            const startedAt = task.startedAt ? new Date(task.startedAt) : null;
            if (startedAt) {
                const startedTime = startedAt.getTime();
                const now = timeNow.getTime();

                // Thêm 1 ngày vào thời điểm hiện tại
                const oneDayLater = new Date(now);
                oneDayLater.setDate(oneDayLater.getDate() + 1);

                // So sánh thời điểm bắt đầu với khoảng thời gian từ thời điểm hiện tại đến thời điểm kết thúc của khoảng thời gian 1 ngày
                if (startedTime > now && startedTime <= oneDayLater.getTime()) {
                    return true;
                }
            }

            return false;
        });
        const sortedUpcoming = [...filteredUpcoming].sort((a, b) => {
            const startedAtA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
            const startedAtB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
            return startedAtB - startedAtA;
        });

        const filteredOngoing = taskList.filter((task) => {
            const startedAt = task.startedAt ?  new Date(task.startedAt) : null;
            const expiredAt = task.expiredAt ? new Date(task.expiredAt): null;
            console.log('Task startedAt:', task.startedAt);
            console.log('Parsed startedAt:', startedAt);
            if (expiredAt && startedAt) {
                const now = timeNow.getTime(); // Lấy timestamp của thời gian hiện tại

                const expiredTime = expiredAt.getTime();
                const startedTime = startedAt.getTime();

                // So sánh theo điều kiện bạn muốn
                if (expiredTime > now && startedTime < now) {
                    return true;
                }
            }
            return false;
        });

        const sortedOngoing = [...filteredOngoing].sort((a, b) => {
            const startedAtA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
            const startedAtB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
            return startedAtB - startedAtA;
        });

        const filteredCompleted = taskList.filter((task) => {
            const startedAt = task.startedAt ? new Date(task.startedAt) : null;
            const expiredAt = task.expiredAt ? new Date(task.expiredAt) : null;

            return !!(expiredAt && expiredAt < timeNow && expiredAt.toDateString() === timeNow.toDateString() && !(startedAt && startedAt > timeNow));

        });
        const sortedCompletedTasks = [...filteredCompleted].sort((a, b) => {
            const expiredAtA = a.expiredAt ? new Date(a.expiredAt).getTime() : 0;
            const expiredAtB = b.expiredAt ? new Date(b.expiredAt).getTime() : 0;
            return expiredAtB - expiredAtA;
        });

        setOngoingTasks(sortedOngoing);
        setUpcomingTasks(sortedUpcoming);
        setCompletedTasks(sortedCompletedTasks);
    }, [taskList]);
    useEffect(() => {

    }, [completedTasks]);
    const onClickTaskDetail = (id: string|undefined) => {
        console.log(id)
        navigate(`/taskDetail/${id}`)
    }
    return (
        <CCard className="mb-4">
            <div style={{backgroundColor: '#F2EAE5', padding: '0', minHeight: '100vh', marginBottom: '-20px'}}>
                <div
                    style={{
                        paddingTop: '30px',
                        paddingLeft: '3vw',
                        paddingRight: '3vw',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <Row>
                        <Col style={{marginRight: '15px'}}>

                            <Card bordered={false} style={{ width: 350, backgroundColor: '#DDDFE7' }}>
                                <Card.Meta title="Sắp bắt đầu" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }} />
                                {upcomingTasks.map((item) => (
                                    <div key={item.id}
                                         onClick={() => onClickTaskDetail(item.id)}

                                         style={{borderRadius: 4, backgroundColor: 'white', padding: '5px 5px 5px 5px', marginBottom: '15px'}}>
                                        <Tag color={setTagColor(setPriorityText(item.priority))} style={{color: '#646570'}}>{setPriorityText(item.priority)}</Tag>
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Task: {item.name}</p>
                                        {item.miniTask?.map((task) => (
                                            <p key={task.id} style={{marginBottom: '5px', color: setColorMiniTaskText(task.status)}}>{task.name}</p>
                                        ))}
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Sẽ bắt đầu vào:</p>

                                        <Tag icon={<CalendarOutlined/>} color={setTagColor(setPriorityText(item.priority))}
                                             style={{color: '#646570', fontWeight: 'bold'}}>{ChangeTimeHour(item.startedAt)}</Tag>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                        <Col style={{marginRight: '15px'}}>
                            <Card bordered={false} style={{width: 350, backgroundColor: '#DDDFE7'}}>
                                <Card.Meta title="Đang thực hiện" style={{fontWeight: 'bold', textAlign: 'center', marginBottom: '15px'}}/>
                                {ongoingTasks.map((item) => (
                                    <div key={item.id}
                                         onClick={() => onClickTaskDetail(item.id)}
                                         style={{borderRadius: 4, backgroundColor: 'white', padding: '5px 5px 5px 5px', marginBottom: '15px'}}>
                                        <Tag color={setTagColor(setPriorityText(item.priority))} style={{color: '#646570'}}>{setPriorityText(item.priority)}</Tag>
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Task: {item.name}</p>

                                        {item.miniTask?.map((task) => (
                                            <p key={task.id} style={{marginBottom: '5px', color: setColorMiniTaskText(task.status)}}>{task.name}</p>
                                        ))}
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Bắt đầu vào:</p>

                                        <Tag icon={<CalendarOutlined/>} color={setTagColor(setPriorityText(item.priority))}
                                             style={{color: '#646570', fontWeight: 'bold'}}>{ChangeTimeHour(item.startedAt)}</Tag>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                        <Col>
                            <Card bordered={false} style={{width: 350, backgroundColor: '#DDDFE7'}}>
                                <Card.Meta title="Kết thúc" style={{fontWeight: 'bold', textAlign: 'center', marginBottom: '15px'}}/>
                                {completedTasks.map((item) => (
                                    <div key={item.id}
                                         onClick={() => onClickTaskDetail(item.id)}

                                         style={{borderRadius: 4, backgroundColor: 'white', padding: '5px 5px 5px 5px', marginBottom: '15px'}}>
                                        <Tag color={setTagColor(setPriorityText(item.priority))} style={{color: '#646570'}}>{setPriorityText(item.priority)}</Tag>
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Task: {item.name}</p>
                                        {item.miniTask?.map((task) => (
                                            <p key={task.id} style={{marginBottom: '5px',
                                                color: task.status === 0 ? '#E65F2B' : setColorMiniTaskText(task.status),
                                            }}>
                                                {task.name}
                                            </p>
                                        ))}
                                        <p style={{marginBottom: '5px', fontWeight: 'bold'}}>Kết thúc vào:</p>

                                        <Tag icon={<CalendarOutlined/>} color={setTagColor(setPriorityText(item.priority))}
                                             style={{color: '#646570', fontWeight: 'bold'}}>{ChangeTimeHour(item.expiredAt)}</Tag>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </CCard>
    );
};

export default ReminderWorkPage;
