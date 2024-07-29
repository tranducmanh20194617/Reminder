import {CCard} from "@coreui/react";
import React, {useEffect, useState} from "react";
import {CChartDoughnut} from "@coreui/react-chartjs";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";
import {useParams} from "react-router";
import {TaskModel} from "../../../models/ReminderModel";
import Function from "../../../const/Function";
import {CalendarOutlined, EditOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Form, Input, message, Modal, Tooltip} from "antd";
import CIcon from "@coreui/icons-react";
import {cilCheckCircle, cilCircle} from "@coreui/icons";


const {TextArea} = Input;

const ReminderTaskDetail = () => {
    const {id} = useParams()
    const [form] = Form.useForm();
    const {
        setTagColor,
        setPriorityText,
        ChangeTimeDetail,
        ChangeTime,
        getBackgroundColor
    } = Function()
    const {
        dispatchEditTask,
        dispatchAddMiniTask,
        vm: vmListTask
    } = TaskListAction()
    const [show, setShow] = useState(true);
    const [check2,setCheck2]= useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [timeNow, setTimeNow] = useState<Date>(new Date());
    const [openInputName, setOpenInputName] = useState(false)
    const [editedName, setEditedName] = useState<string | undefined>('');
    const [countAdd, setCountAdd] = useState(0);
    const [countCheck, setCountCheck] = useState(0);
    const [openInputDescription, setOpenInputDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [check, setCheck] = useState(false)
    const [checkIcon, setCheckIcon] = useState(false)
    const [countMess, setCountMess] = useState(0)
    const [taskDetail, setTaskDetail] = useState<TaskModel>()
    const [miniTaskStatus, setMiniTaskStatus] = useState<{ id?: string | undefined; status: number | undefined }[]>([]);
    const [chartData, setChartData] = useState<number[]>([0, 0, 0]);
    const [complete, setComplete] = useState(0)
    const [taskMiniDetails, setTaskMiniDetails] = useState<{ id?: string | undefined; status: number | undefined, name: string | undefined }[]>([]);
    const [saveButton, setSaveButton] = useState(false)
    useEffect(() => {
        const currentDateTime = new Date();
        console.log(currentDateTime.getTime())
        setTimeNow(currentDateTime)
    }, []);
    useEffect(() => {
        const foundDetail = vmListTask.items.find((detail) => detail.id === id);
        setTaskDetail(foundDetail);
        setEditedName(foundDetail?.name)
        setEditedDescription(foundDetail?.description)
        if (foundDetail?.miniTask) {
            // Initialize mini task statuses with 0 (assuming 0 means incomplete)
            const initialStatuses = foundDetail.miniTask.map((miniTask) => ({
                id: miniTask.id,
                status: miniTask.status,
                expiredAt: miniTask.expiredAt || undefined, // Set to undefined if expiredAt is not available
            }));
            setMiniTaskStatus(initialStatuses);
            const initialMiniDetails = foundDetail.miniTask.map((miniTask) => ({
                id: miniTask.id,
                status: miniTask.status,
                name: miniTask.name,
            }));
            setTaskMiniDetails(initialMiniDetails);
        }
    }, [taskDetail, vmListTask]);

    useEffect(() => {
        const expiredAtTime = taskDetail?.expiredAt ? new Date(taskDetail.expiredAt) : null;
        const startAtTime = taskDetail?.startedAt ? new Date(taskDetail.startedAt) : null;
        if (expiredAtTime && startAtTime) {
            const now = timeNow.getTime();
            const dateNow = timeNow.toLocaleDateString()
            const expiredTimeDate = expiredAtTime.toLocaleDateString();
            const expiredTime = expiredAtTime.getTime();
            const startTime = startAtTime.getTime();

            if (now > expiredTime) {

                // If current time is greater than expiredAt, set all mini task statuses to 2
                const allExpiredStatuses = miniTaskStatus.map((status) => ({
                    ...status,
                    status: status.status === 0 ? 2 : status.status,
                }));
                console.log(now)
                console.log(expiredTime)
                setCheck(true)
                setShow(true)
                setCheck2(true)
                setMiniTaskStatus(allExpiredStatuses);
                const data = {
                    name: editedName,
                    description: editedDescription,
                    mini_tasks: allExpiredStatuses
                }
                console.log(data)
                dispatchEditTask(id, data)
            }

            if (now < startTime) {
                setCheckIcon(true)
                setCheck2(false)
            }
            if (dateNow !== expiredTimeDate) {
                console.log(dateNow)
                console.log(expiredTimeDate)
                setCheckIcon(true)
                setCheck(true)
                setShow(true)
                setCheck2(true)
            }
            if(now < expiredTime)
            {
                setCheck2(false)
            }

        }

    }, [taskDetail?.expiredAt, timeNow]);
    useEffect(() => {
        // Calculate the count of each status in miniTaskStatus
        const statusCount = miniTaskStatus.reduce(
            (count, status) => {
                if (status.status === 1) count[0]++;
                else if (status.status === 2) count[1]++;
                else if (status.status === 0) count[2]++;
                return count;
            },
            [0, 0, 0]
        );
        setChartData(statusCount);
        const totalMiniTasks = miniTaskStatus.length;
        const completedTasks = miniTaskStatus.filter((status) => status.status === 1).length;
        const completionPercentage = (completedTasks / totalMiniTasks) * 100;

        // Làm tròn xuống
        const roundedCompletionPercentage = Math.floor(completionPercentage);

        setComplete(roundedCompletionPercentage);

    }, [miniTaskStatus]);

    useEffect(() => {
        if (countAdd <= 0) {
            setSaveButton(true)
        } else {
            setSaveButton(false)
        }
    }, [countAdd]);
    useEffect(() => {
        if (countMess !== 0) {
            messageApi.error('Chưa đến time làm task hoặc task đã hết hạn !!').then()
            setCountCheck(0)
        }
    }, [countMess]);
    useEffect(() => {
        if (show && countCheck !== 0&&!check2) {
            messageApi.warning('Bạn hãy ấn vào nút chỉnh sửa để chỉnh sửa mini task!!').then()
        }
    }, [countCheck]);
    const handleNameEditClick = () => {
        setOpenInputName(!openInputName);
        // Set the initial value of the editedName to the current task name

    };
    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleNameSaveClick = () => {
        setOpenInputName(false);
        if (editedName === '') {
            setEditedName(taskDetail?.name)
        }

    };

    const handleDescriptionEditClick = () => {
        setOpenInputDescription(!openInputDescription);

    };

    const handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedDescription(e.target.value);

    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleDescriptionSaveClick = () => {
        setOpenInputDescription(false);
        if (editedDescription == '') {
            setEditedDescription(taskDetail?.description)
        }
    };
    const handleIconClick = (taskId: string | undefined) => {
        if (!show) {
            if (!check && !checkIcon) {
                console.log(show, "123")
                const taskIndex = miniTaskStatus.findIndex((status) => status.id === taskId);
                if (taskIndex !== -1) {
                    // Create a copy of miniTaskStatus to avoid direct mutation
                    const updatedMiniTaskStatus = [...miniTaskStatus];
                    // Update the status to 1
                    updatedMiniTaskStatus[taskIndex] = {
                        ...updatedMiniTaskStatus[taskIndex], // Retain existing properties
                        status: updatedMiniTaskStatus[taskIndex].status === 0 ? 1 : 0,
                    };
                    // Set the updated miniTaskStatus
                    setMiniTaskStatus(updatedMiniTaskStatus);
                }
            } else {
                setCountMess(1)
            }
        } else {
            setCountCheck(1)
        }
    };
    const handleEditClick = () => {
        setConfirmLoading(true);
        setShow(true)
        setCheck(false)
        setCheck2(false)
        setCountCheck(0)
        setCountMess(0)

        const data = {
            name: editedName,
            description: editedDescription,
            mini_tasks: miniTaskStatus
        }
        console.log(data)
        dispatchEditTask(id, data)
        messageApi.success('Chỉnh sửa task thành công').then()
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);

        }, 1000);


    }
    const handleEditButtonClick = () => {
        if (form.getFieldValue('names') !== undefined) {
            dispatchAddMiniTask({task_id: id, name: form.getFieldValue('names')})
            form.resetFields();
            setCountAdd(0)
        }


    };

    return (
        <>
            {contextHolder}
            <CCard className="mb-4 ">
                <div style={{backgroundColor: '#F2EAE5', padding: '0', minHeight: '100vh', marginBottom: '-20px'}}>
                    <div
                        style={{
                            marginTop: '10px',
                            maxWidth: 1200,
                            paddingLeft: '2vw',
                            paddingRight: '2vw',
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: '23px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between', // Align items with space between
                                padding: '0 10px', // Add padding for better spacing
                            }}
                        >
                            <p style={{fontWeight: "bold", fontSize: '40px'}}>Chi tiết công việc</p>

                            {!check2 && (  // Add this line for conditional rendering
                                <Button
                                    style={{
                                        borderRadius: 40,
                                        width: 145,
                                        height: 62,
                                        backgroundColor: '#5FBA40',
                                        color: 'black',
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => {
                                        setShow(false)
                                        setCheck2(true)
                                    }}
                                >Chỉnh sửa</Button>
                            )}
                        </div>
                        <p style={{fontSize: '21px', marginLeft: '10px'}}>Tên công việc: {openInputName ? (
                            <>
                                <Input
                                    value={editedName}
                                    onChange={handleNameInputChange}
                                    style={{marginRight: '10px', width: '200px'}}
                                />
                                <Button onClick={handleNameSaveClick}>Lưu</Button>
                            </>
                        ) : (
                            <>
                                {editedName}
                                {!show && (  // Add this line for conditional rendering
                                    <Tooltip title="Chỉnh sửa tên">
                                        <EditOutlined
                                            style={{fontSize: 24, marginLeft: 20}}
                                            onClick={handleNameEditClick}
                                        />
                                    </Tooltip>
                                )}
                            </>
                        )}
                        </p>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#FED36A',
                                    width: '90px',
                                    height: '90px',
                                    marginRight: '10px',
                                    marginLeft: '20px',
                                }}>
                                    <CalendarOutlined style={{fontSize: 41}}/>
                                </div>

                                <div style={{textAlign: 'left'}}>
                                    <div>
                                        <div style={{alignItems: 'center', flexDirection: 'row', display: 'flex'}}>
                                            <div style={{textAlign: 'left', marginRight: '25px'}}>
                                                <b>
                                                  <span style={{display: 'flex', alignItems: 'center', fontSize: '13px', opacity: 0.5}}>
                                                    Bắt đầu:
                                                  </span>
                                                </b>
                                                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                                                    {ChangeTimeDetail(taskDetail?.startedAt)}

                                                </div>
                                            </div>
                                            <div style={{textAlign: 'left'}}>
                                                <b>
                                                  <span style={{display: 'flex', alignItems: 'center', fontSize: '13px', opacity: 0.5}}>
                                                      Kết thúc:
                                                  </span>
                                                </b>
                                                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                                                    {ChangeTimeDetail(taskDetail?.expiredAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'left', marginRight: '40px'}}>
                                            <b>
                                                  <span style={{display: 'flex', alignItems: 'center', fontSize: '13px', opacity: 0.5}}>
                                                    Ngày:
                                                  </span>
                                            </b>
                                            <div style={{marginTop: '5px', fontSize: '20px', fontWeight: 'bold'}}>
                                                {ChangeTime(taskDetail?.startedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px', marginRight: '20px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#FED36A',
                                    width: '90px',
                                    height: '90px',
                                    marginRight: '10px',
                                    marginLeft: '20px',
                                }}>
                                    <InboxOutlined style={{fontSize: 42}}/>
                                </div>
                                <div style={{textAlign: 'left'}}>
                                    <div>
                                        <div style={{alignItems: 'center', flexDirection: 'row', display: 'flex'}}>
                                            <div style={{textAlign: 'left', marginRight: '40px'}}>
                                                <b>
                                                  <span style={{display: 'flex', alignItems: 'center', fontSize: '13px', opacity: 0.5}}>
                                                    Loại
                                                  </span>
                                                </b>
                                                <div style={{fontSize: '20px', marginTop: '10px', fontWeight: 'bold'}}>
                                                    {taskDetail?.tag}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{flexDirection: 'column', display: 'flex'}}>
                                <p style={{fontWeight: 'bold', fontSize: '25px', opacity: 0.7}}>Tiến trình hoàn thành</p>
                                <p style={{fontSize: '25px'}}>Ưu tiên: <span style={{fontWeight: 'bold', color: setTagColor(setPriorityText(taskDetail?.priority))}}>{setPriorityText(taskDetail?.priority)}</span></p>
                            </div>
                            <div
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    marginTop: "-30px",
                                    marginLeft: "30px",
                                    position: "relative", // Add position relative
                                }}
                            >
                                <CChartDoughnut
                                    title="Doughnut"
                                    data={{
                                        labels: ["Hoàn thành", "Trễ hạn ", "Chưa hoàn thành"],
                                        datasets: [
                                            {
                                                backgroundColor: ["#5FBA40", "#E65F2B", "#4A4A4A"],
                                                data: chartData,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }}
                                />
                                <div
                                    style={{
                                        color: '#E65F2B',
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    {complete}%
                                </div>
                            </div>
                        </div>
                        <div style={{marginLeft: '5px', display: 'flex', flexDirection: 'row', marginTop: '10px'}}>
                            <div style={{marginLeft: '20px', display: 'flex', flexDirection: 'column'}}>
                                <div>
                                    <p style={{fontSize: '25px', fontWeight: 'bold'}}>Mô tả
                                        {!show && (  // Add this line for conditional rendering
                                            <Tooltip title="Chỉnh sửa Mô tả">
                                                <EditOutlined style={{fontSize: 24, marginLeft: 20}}
                                                              onClick={handleDescriptionEditClick}
                                                />
                                            </Tooltip>
                                        )}

                                    </p>
                                    <div style={{width: 520, fontSize: 20, wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                                        {openInputDescription ? (
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <TextArea
                                                    value={editedDescription}
                                                    onChange={handleDescriptionInputChange}
                                                    style={{margin: '10px 0', width: '400px', height: '180px'}}
                                                />
                                                <Button onClick={handleDescriptionSaveClick} style={{width: '50px'}}>Lưu</Button>
                                            </div>
                                        ) : (
                                            <>
                                                {editedDescription}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p style={{fontSize: '25px', fontWeight: 'bold', marginLeft: '10px'}}>Nhiệm vụ

                                    {saveButton ? null : (
                                        <>
                                            <Button
                                                type={"primary"}
                                                style={{
                                                    marginLeft: '23px',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',

                                                }}
                                                onClick={handleEditButtonClick}
                                            >Lưu</Button>
                                        </>
                                    )}
                                </p>
                                <div style={{marginTop: '10px'}}>
                                    {taskMiniDetails.map((task, index) => (
                                        <div
                                            key={index++}
                                            style={{
                                                width: 370,
                                                height: 58,
                                                border: '1px solid black',
                                                marginBottom: '10px',
                                                fontSize: 18,
                                                display: 'flex',
                                                background: getBackgroundColor(miniTaskStatus.find((status) => status.id === task.id)?.status),
                                                alignItems: 'center',
                                                justifyContent: 'space-between', // Align items with space between
                                                padding: '0 10px', // Add padding for better spacing
                                            }}
                                        >
                                            <p style={{color: 'white', marginTop: '15px'}}>{task.name}</p>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: 40,
                                                height: 40,
                                                backgroundColor: '#FED36A',
                                                justifyContent: 'center'
                                            }}
                                                 onClick={() => handleIconClick(task.id)}
                                            >
                                                <CIcon icon={miniTaskStatus.find((status) => status.id === task.id)?.status === 0 ? cilCircle : cilCheckCircle} size="xl"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Form
                                    name="dynamic_form_item"
                                    style={{maxWidth: 1200}}
                                    form={form}
                                >
                                    <Form.List
                                        name="names"
                                        rules={[
                                            {
                                                validator: async (_, names) => {
                                                    if (!names || names.length < 2) {
                                                        return Promise.reject(new Error('At least 2 passengers'));
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        {(formFields, {add, remove}) => {
                                            return (
                                                <>
                                                    {formFields.map((field) => (
                                                        <Form.Item
                                                            required={false}
                                                            key={field.key}
                                                        >
                                                            <Form.Item
                                                                {...field}
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        whitespace: true,
                                                                        message: "Please input Mini Task name or delete this field.",
                                                                    },
                                                                    {min: 5, message: 'Mini task phải có ít nhất 5 kí tự!'},
                                                                    {max: 30, message: 'Mini task không được quá 30 kí tự!'},
                                                                ]}
                                                                noStyle
                                                            >
                                                                <Input placeholder="Minitask" style={{
                                                                    width: 370,
                                                                    height: 40,
                                                                    border: '1px solid black',
                                                                }}/>
                                                            </Form.Item>
                                                            {formFields.length > 0 ? (
                                                                <>
                                                                    <MinusCircleOutlined
                                                                        style={{marginLeft: '10px'}}
                                                                        className="dynamic-delete-button"
                                                                        onClick={() => {
                                                                            remove(field.name);
                                                                            setCountAdd(countAdd - 1);
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : null}
                                                        </Form.Item>
                                                    ))}
                                                    <Form.Item>
                                                        {!show && (  // Add this line for conditional rendering
                                                            <Button
                                                                type="dashed"
                                                                onClick={() => {
                                                                    add();
                                                                    setCountAdd(countAdd + 1);
                                                                }}
                                                                style={{
                                                                    width: 318,
                                                                    height: 57,
                                                                    fontSize: 18,
                                                                    marginLeft: '23px',
                                                                    backgroundColor: '#FED36A'
                                                                }}
                                                                icon={<PlusOutlined/>}
                                                            >
                                                                Thêm Mini task
                                                            </Button>
                                                        )}

                                                    </Form.Item>
                                                </>
                                            );
                                        }}
                                    </Form.List>
                                </Form>


                            </div>
                        </div>
                    </div>
                </div>
            </CCard>
            {!show && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 40,
                        right: 40,
                        zIndex: 1, // Đặt mức z-index cao hơn để giữ nó trên các phần tử khác
                    }}
                >
                    <Button
                        style={{
                            borderRadius: 40,
                            width: 145,
                            height: 62,
                            backgroundColor: '#5FBA40',
                            color: 'black',
                            fontWeight: "bold",
                        }}
                        onClick={() => setOpen(true)}
                    >Lưu thay đổi</Button>

                </div>
            )}
            <Modal
                title="Xác nhận lại"
                open={open}
                onOk={handleEditClick}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>Bạn có xác định muốn chỉnh sửa dữ liệu không❓</p>
            </Modal>
        </>


    )
}
export default ReminderTaskDetail