/*
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-02 15:18:13
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\mixins\video.js
 * @LastEditTime: 2021-04-09 14:57:53
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
 */
import RMT from "@/assets/js/signalROptions/signalROptions";
// import AgoraRTC from "agora-rtc-sdk-ng"

export default {
    data() {
        return {
            rtc: null,
            error:false
        };
    },
    methods: {
        initRMT() {
            this.rtc = new RMT({ groupNumber: "111" });
            var me = this;
            me.rtc.startCall().then(res => {
                    console.log(res);    
                })
                .catch(err => {
                    me.error = true;
                    switch (err.code) {
                        case "DEVICE_NOT_FOUND":
                            me.$Message.error("找不到设备");
                            break;
                    }
                });
        },
    },
    mounted() {

    },
    created() {

    }
};