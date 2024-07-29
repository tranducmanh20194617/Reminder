import {useTranslation} from "react-i18next";
import {getDate, parseISO} from 'date-fns';

const Function = () => {
    const {t} = useTranslation();
    const setIcon = (date: string | undefined) => {
        if (date !== undefined) {
            const targetDate = new Date(date);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
            return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        } else {
            return 0
        }
    }
    const setUpDateForUserInfo = (date: string | undefined) => {
        if (date !== undefined) {
            const targetDate = new Date(date);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            let result = '';
            if (days > 15) {
                result += `${t('text.inactiveDays', {label: days})}`;
                return result
            } else if (days > 0) {
                result += `${days} ${t('text.day')}`;
            } else {
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);

                if (hours > 0) {
                    result += `${hours} ${t('text.hour')}`;
                }
                if (minutes > 0 && minutes % 60 !== 0) {
                    result += ` ${minutes % 60} ${t('text.minute')}`;
                }
            }
            if (result === '') {
                result = `${t('text.seconds')}`;
            }
            return (result + `${t('text.ago')}`)
        }
    }
    const setUpDateForDiaryPost = (date: string | undefined) => {
        if (date !== undefined) {
            const targetDate = new Date(date);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            let result = '';
            if (days > 0) {
                result += `${days} ${t('text.day')}`;

            } else {
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);

                if (hours > 0) {
                    result += `${hours} ${t('text.hour')}`;
                }
                if (minutes > 0 && minutes % 60 !== 0) {
                    result += ` ${minutes % 60} ${t('text.minute')}`;
                }
            }
            if (result === '') {
                result = `${t('text.seconds')}`;
            }
            return (result + `${t('text.ago')}`)
        }
    }
    const ChangeTime = (time: string | undefined) => {
        if (time) {
            const dateObj = new Date(time);
            return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        }
    }

    const ChangeTimeHour = (time: string | undefined) => {
        if (time) {
            const dateObj = new Date(time);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0
            const day = dateObj.getDate().toString().padStart(2, '0')
            const hours = dateObj.getHours().toString().padStart(2, '0')
            const minutes = dateObj.getMinutes().toString().padStart(2, '0')

            return `${hours}:${minutes} ${day}/${month}/${year}`;

        }
    }
    const ChangeTimeDetail = (time: string | undefined) => {
        if (time) {
            const dateObj = new Date(time);
            return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

        }
    }
    const ActivityText = (key: string | undefined) => {
        switch (key) {
            case "user.login":
                return t('text.loginSuccess');
            case "user.logout":
                return t('text.logoutSuccess');
            case "user.logout.all":
                return t('text.logoutFar');
            case "edit.user":
                return t('text.editAccount');
            case "user.logout.far":
                return t('text.logoutFar');
            case "delete.user":
                return t('text.deleteAccount');
            case "user.delete":
                return t('text.deleteAdmin');
            case "user.register":
                return t('text.adminRegister');
            default:
                return `None`;
        }
    }
    const StateDetail = (state: number | undefined) => {
        switch (state) {
            case 0:
                return true;
            case 1:
                return false;
            case 2:
                return true;
            default:
                return `....`;
        }
    }
    const setFlag = (key: number) => {
        switch (key) {
            case 1:
                return 'https://file.vfo.vn/hinh/2013/12/co-viet-nam-2.jpg'
            case 2:
                return 'https://th.bing.com/th/id/OIP.U-h9wYdOSH047roWjY_1TgHaE3?pid=ImgDet&rs=1'
            case 3:
                return 'https://th.bing.com/th/id/OIP.TJhS9Ks-cfxuk8TLTcBWmgHaFQ?w=268&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7'
        }
    }
    const setExpiresAtTime = (time: string | undefined) => {
        const TimeNow: Date = new Date();
        if (time != undefined) {
            const TimeExpires: Date = new Date(time);
            return TimeNow > TimeExpires;
        }
    }
    const decimalToDMS = (coordinatesString: string | undefined) => {
        if (coordinatesString !== undefined) {
            const [latitude, longitude] = coordinatesString.split(',').map(coord => parseFloat(coord.trim()));
            const convertDMS = (coord: number): [number, number, number] => {
                const degrees = Math.floor(coord);
                const minutes = Math.floor((coord - degrees) * 60);
                const seconds = Math.round(((coord - degrees) * 60 - minutes) * 60);
                return [degrees, minutes, seconds];
            };
            let result: string;

            const [latDeg, latMin, latSec] = convertDMS(latitude);
            const [longDeg, longMin, longSec] = convertDMS(longitude);

            const latDir = latitude >= 0 ? 'N' : 'S';
            const longDir = longitude >= 0 ? 'E' : 'W';

            const latString = `${Math.abs(latDeg)}° ${latMin}' ${latSec}" ${latDir}`;
            const longString = `${Math.abs(longDeg)}° ${longMin}' ${longSec}" ${longDir}`;
            result = `${latString} ${longString}`
            return result
        }
    };
    const setPriorityColor = (tag: string|undefined) => {
        switch (tag) {
            case 'Thấp':
                return '#46F7B7'
            case 'Trung bình':
                return '#F5EB88'
            case 'Cao':
                return '#FFA775'
            case 'Rất Cao':
                return '#EE726B'
            default:
                return 'white'
        }
    }

    const setPriorityText = (priority: number|undefined) => {
        switch (priority) {
            case 0:
                return 'Thấp'
            case 1:
                return 'Trung bình'
            case 2:
                return 'Cao'
            case 3:
                return 'Rất Cao'
            case undefined:
                return 'white'
        }
    }
    const setTodayInWeek =(index:number)=>{
         switch (index){
             case 1:
                 return 'Mon'
             case 2:
                 return 'Tue'
             case 3:
                 return 'Wed'
             case 4:
                 return 'Thu'
             case 5:
                 return 'Fri'
             case 6:
                 return 'Sat'
             case 7:
                 return 'Sun'
             default:
                 return 'not'
         }
    }
    const dateTimeChangeToThu = (value: string | undefined) => {
        if (value !== undefined) {
            const parsedTime = parseISO(value);
            return getDate(parsedTime);
        }
        return null; // or handle the case when value is undefined
    };
    const setColorMiniTaskText =(value:number|undefined)=> {
        switch (value) {
            case 0:
                return 'black'
            case 1:
                return '#5FBA40'
            case 2:
                return '#E65F2B'
        }
    }
    const getBackgroundColor = (status:number|undefined) => {
        switch (status) {
            case 1:
                return '#5FBA40'; // Green
            case 0:
                return '#4A4A4A'; // Black
            case 2:
                return '#E65F2B'; // Red
            default:
                return '#4A4A4A'; // Default color or any other color you prefer
        }
    };
    const setText =(text:any)=>{

    }

    return {
        setColorMiniTaskText,
        ChangeTimeHour,
        ChangeTimeDetail,
        dateTimeChangeToThu,
         setPriorityText,
        setTodayInWeek,
        setIcon,
        setUpDate: setUpDateForUserInfo,
        StateDetail,
        ActivityText,
        setFlag,
        setExpiresAtTime,
        decimalToDMS,
        ChangeTime,
        setUpDateForDiaryPost,
        setTagColor: setPriorityColor,
        getBackgroundColor
    }
}
export default Function



