import {CCard} from "@coreui/react";
import React, {useEffect, useRef, useState} from 'react';
import type {InputRef} from 'antd';
import {Button, DatePicker, Divider, Form, Input, message, Select, Space, TimePicker} from "antd";
import {CalendarOutlined, ClockCircleOutlined, DeploymentUnitOutlined, FieldTimeOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, ReconciliationOutlined} from "@ant-design/icons";
import {TaskListAction} from "../../../recoil/Reminder/ReminderTasklList/TaskListAction";
import {E_SendingStatus} from "../../../const/Events";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";

let index = 0;
const formItemLayout = {
    labelCol: {
        xs: {span: 20},
        sm: {span: 3},
    },
    wrapperCol: {
        xs: {span: 20},
        sm: {span: 20},
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: {span: 20, offset: 0},
        sm: {span: 20, offset: 3},
    },
};
const ReminderAddTaskPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const {
        dispatchCreateTask,
        vmForm
    } = TaskListAction()
    const [items, setItems] = useState(['Nhà', 'Học tập', 'Công việc']);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);
    useEffect(() => {
        if (vmForm.isLoading === E_SendingStatus.success) {
            messageApi.success("Thêm công việc thành công ").then(() => {
                // Delay the navigation by 2 seconds
                setTimeout(() => {
                    form.resetFields();
                    navigate(RouteConfig.REMINDER_DASHBOARD);
                }, 500);
            });
        } else if (vmForm.isLoading === E_SendingStatus.error && vmForm.error) {
            messageApi.error("Hình như có lỗi xảy ra hãy xem lại").then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmForm]);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const [form] = Form.useForm(); // Add this line to obtain the form instance

    const handleSelectLoopChange = (value: string) => {
        // Manually update the form field value
        form.setFieldsValue({loop: value});
    };
    const handleSelectTimesChange = (value: string) => {
        // Manually update the form field value
        form.setFieldsValue({times: value});
    };
    const handleSelectTagChange = (value: string) => {
        // Manually update the form field value
        form.setFieldsValue({tag: value});
    };

    const handleSelectPriorityChange = (value: string) => {
        // Manually update the form field value
        form.setFieldsValue({priority: value});
    };
    const onFinish = async (values: any) => {
        console.log("onFinish:", values);
        const startTime = `${values.day} ${values.timeStart}`;
        const endTime = `${values.day} ${values.timeEnd}`;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

        if (startTime < currentDateTime) {
            messageApi.error("Thời gian bắt đầu không thể nhỏ hơn thời gian hiện tại").then();
            return;
        } else if (startTime > endTime) {
            messageApi.error("Thời gian bắt đầu không thể lớn hơn thời gian kết thúc").then();
            return;
        } else if (new Date(startTime).getTime() - new Date(currentDateTime).getTime() < 10 * 60 * 1000) {
            // Check if startTime is less than 10 minutes from currentDateTime
            messageApi.error("Thời gian bắt đầu không thể quá gần hiện tại").then();
            return;
        }
       else{
            const data: any = {
                name: values.name,
                description: values.description,
                tag: values.tag,
                priority: values.priority,
                started_at: startTime,
                expired_at: endTime,
                loop: values.loop,
                times: values.times,
                mini_tasks: values.mini_tasks,
            };
            console.log("data: " , data)
            dispatchCreateTask(data);
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("onFinishFailed:", errorInfo);
        messageApi.error("Hãy nhập đủ các trường").then()

    };
    return (
        <>
            {contextHolder}
            <CCard className="mb-4">

                <div style={{backgroundColor: '#F2EAE5', padding: '0', minHeight: '100vh', marginBottom: '-20px'}}>
                    <div
                        style={{
                            marginTop: '10px',
                            maxWidth: 1200,
                            paddingLeft: '3vw',
                            paddingRight: '3vw',
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: '23px',
                        }}
                    >
                        <p style={{fontWeight: "bold", fontSize: '40px'}}>Tạo công việc</p>
                        <Form
                            name="basic"
                            labelCol={{span: 3}}
                            wrapperCol={{span: 20}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            style={{width: "100%"}}
                            form={form}
                        >
                            <Form.Item
                                label={
                                    <span style={{fontWeight: 'bold'}}>Tên công việc</span>
                                }
                                name="name"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập tên công việc!'},
                                    {min: 5, message: 'Tên công việc phải có ít nhất 5 kí tự!'},
                                    {max: 30, message: 'Tên công việc không được quá 30 kí tự!'},
                                ]}
                            >
                                <Input
                                    size={"large"}
                                    placeholder="Hãy đặt tên gợi nhớ cho công việc của bạn !!!!"

                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <span style={{fontWeight: 'bold'}}>Mô tả</span>
                                }
                                name="description"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập mô tả!'},
                                    {min: 5, message: 'Mô tả phải có ít nhất 5 kí tự!'},
                                    {max: 100, message: 'Mô tả không được quá 100 kí tự!'},
                                ]}
                            >
                                <Input.TextArea
                                    maxLength={400}
                                    style={{minHeight: 160}}
                                    placeholder={
                                        "Hãy mô tả 1 chút về công việc của bạn\n" +
                                        "-> Mục tiêu đạt được: Mỗi nhiệm vụ nên có đích đến. Hãy viết rõ mục tiêu nhé !!!\n" +
                                        "-> ...\n"
                                    }
                                />
                            </Form.Item>

                            <Form.List
                                name="mini_tasks"
                                initialValue={['']}
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(new Error('At least 1 Mini task'));
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, {add, remove}, {errors}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                                <Form.Item
                                                    label={index === 0 ? <span style={{fontWeight: 'bold'}}>Mini Task</span> : ''}
                                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                                    required={false}
                                                    style={{flex: '1', marginRight: '8px', marginBottom: '10px'}}
                                                >
                                                    <Form.Item
                                                        {...field}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: "Please input mini task",
                                                            },
                                                        ]}
                                                        noStyle
                                                    >
                                                        <Input size={"large"} placeholder="Nhập Mini task" style={{width: '100%'}}/>
                                                    </Form.Item>
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => remove(field.name)}
                                                        style={{marginBottom: '24px', marginLeft: '-24px'}}
                                                    />
                                                ) : null}
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                style={{marginLeft: '137px', width: '100%'}}
                                                icon={<PlusOutlined/>}
                                            >
                                                Thêm Mini Task
                                            </Button>
                                            <Form.ErrorList errors={errors}/>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>


                            <Form.Item
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Bắt đầu</span>
                                }
                                name="timeStart"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                            >
                                <div style={{marginLeft: '-8px', position: 'relative'}}>
                                    <ClockCircleOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <TimePicker
                                        size={"large"}
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        placeholder="Chọn thời gian bắt đầu"
                                        format="HH:mm:ss"  // Optionally specify the format
                                        onChange={(_time, timeString) => {
                                            // Manually update the form field value
                                            form.setFieldsValue({timeStart: timeString});
                                        }}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                labelCol={{span: 4}}
                                wrapperCol={{span: 20}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Kết thúc</span>
                                }
                                name="timeEnd"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50%)'}}
                            >
                                <div style={{position: 'relative'}}>
                                    <ClockCircleOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <TimePicker
                                        size={"large"}
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        placeholder="Chọn thời gian kết thúc"
                                        format="HH:mm:ss"  // Optionally specify the format
                                        onChange={(_time, timeString) => {
                                            // Manually update the form field value
                                            form.setFieldsValue({timeEnd: timeString});
                                        }}
                                    />
                                </div>

                            </Form.Item>
                            <Form.Item
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Ngày</span>
                                }
                                name="day"
                                rules={[{required: true}]}
                                style={{width: 'calc(50% - 8px)'}}
                            >
                                <div style={{marginLeft: '-8px', position: 'relative'}}>
                                    <CalendarOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <DatePicker
                                        size={"large"}
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        placeholder="Chọn ngày làm task "
                                        format="YYYY-MM-DD"  // Optionally specify the format
                                        onChange={(_time, timeString) => {
                                            // Manually update the form field value
                                            form.setFieldsValue({day: timeString});
                                        }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Lặp Lại</span>
                                }
                                name="loop"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50% - 8px)'}}>
                                <div style={{marginLeft: '-8px', position: 'relative'}}>
                                    <ReconciliationOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <Select
                                        size={"large"}
                                        placeholder=" Day/Week"
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        options={[
                                            {value: 'day', label: 'Day'},
                                            {value: 'week', label: 'Week'},
                                        ]}
                                        onChange={handleSelectLoopChange}  // Handle select change
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                labelCol={{span: 4}}
                                wrapperCol={{span: 20}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Số Lần</span>
                                }
                                name="times"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50%)'}}
                            >
                                <div style={{position: 'relative'}}>
                                    <FieldTimeOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <Select
                                        size={"large"}
                                        placeholder="Chọn số lần lặp lại"
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        options={[
                                            {value: 0, label: 'Không lặp'},
                                            {value: 1, label: '1'},
                                            {value: 2, label: '2'},
                                            {value: 3, label: '3'},
                                            {value: 4, label: '4'},
                                            {value: 5, label: '5'},
                                            {value: 6, label: '6'},

                                        ]}
                                        onChange={handleSelectTimesChange}  // Handle select change
                                    />
                                </div>

                            </Form.Item>
                            <Form.Item
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Độ ưu tiên</span>
                                }
                                name="priority"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50% - 8px)'}}>
                                <div style={{marginLeft: '-8px', position: 'relative'}}>
                                    <DeploymentUnitOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <Select
                                        size={"large"}
                                        placeholder="Chọn Độ ưu tiên"
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        options={[
                                            {value: 0, label: 'Thấp'},
                                            {value: 1, label: 'Trung bình'},
                                            {value: 2, label: 'Cao'},
                                            {value: 3, label: 'Rất cao'},
                                        ]}
                                        onChange={handleSelectPriorityChange}  // Handle select change
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                labelCol={{span: 4}}
                                wrapperCol={{span: 20}}
                                label={
                                    <span style={{fontWeight: 'bold'}}>Thẻ</span>
                                }
                                name="tag"
                                rules={[{required: true}]}
                                style={{display: 'inline-block', width: 'calc(50%)'}}
                            >
                                <div style={{position: 'relative'}}>
                                    <InboxOutlined className="site-form-item-icon" style={{paddingRight: '10px', paddingLeft: '10px', fontSize: '38px', color: 'black', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', background: '#FED36A'}}/>
                                    <Select
                                        size={"large"}
                                        placeholder="Chọn thẻ"
                                        style={{border: 'none', color: 'white', width: 'calc(85% - 40px)', marginLeft: '70px'}}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{margin: '8px 0'}}/>
                                                <Space style={{padding: '0 8px 4px'}}>
                                                    <Input
                                                        placeholder="Nhập thẻ"
                                                        ref={inputRef}
                                                        value={name}
                                                        onChange={onNameChange}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                                                        Thêm thẻ
                                                    </Button>
                                                </Space>
                                            </>
                                        )}
                                        options={items.map((item) => ({label: item, value: item}))}
                                        onChange={handleSelectTagChange}  // Handle select change
                                    />
                                </div>

                            </Form.Item>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingRight: "20px",
                                    marginTop: "20px"
                                }}>
                                <Button
                                    style={{width: '150px', height: '58px', backgroundColor: '#FED36A', color: 'black', fontWeight: "bold"}}
                                    htmlType="submit"
                                >Tạo
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </CCard>
        </>
    );
}

export default ReminderAddTaskPage;
