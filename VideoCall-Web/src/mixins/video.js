/*
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-02 15:18:13
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\mixins\video.js
 * @LastEditTime: 2021-04-23 15:18:49
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
 */
export default {
    data() {
        return {
            rtc: null,
            error:false
        };
    },
    methods: {
        setMulitVideo(items,type){
            var $=this;
            var count = 0;
            if(type==2){
                for(var i=0;i<items.length;i++){
                if(items[i]['id']=='default'){
                    items[i].style.display = "none";  
                } else {
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = `4 / ${1 + (count*12)} / 11 / ${13 +(13*count)}`;
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    count++;
                }
                }
            } else if(type==3){
                debugger
                for(var i=0;i<items.length;i++){
                if(i==0){
                    items[i].style.display = "none";  
                } else if(i==1){
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = '2 / 7/ 6 / 19';
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                } else {
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = `7 /  ${1 + (count*12)} / 12 / ${13 +(13*count)}`;  //7 / 13 / 12 / 26
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    count++;
                }
                }  
            } else if(type==4){
                for(var i=0;i<items.length;i++){
                if(i==0){
                    items[i].style.display = "none";  
                } else if(i==1){
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = '2 / 1 / 7 / 13';
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                } else if(i==2){
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = '2 / 13 / 7/ 26';  //7 / 13 / 12 / 26
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    count++;
                } else if(i==3){
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = '7 / 1 / 12 / 13';  //7 / 13 / 12 / 26
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    count++;
                } else if(i==4){
                    items[i].style.width = "100%";
                    items[i].style.height = "100%";
                    items[i].style.gridArea = '7 / 13 / 12 / 26';  //7 / 13 / 12 / 26
                    items[i].style.zIndex = 0;
                    items[i].style.border = "1px solid #FFFFFF";
                    items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    count++;
                }
                }   
            } else if(type==5){
                for(var i=0;i<items.length;i++){
                    if(i==0){
                        items[i].style.display = "none";  
                    } else if(i==1){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 2 / 5 / 10';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==2){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 14 / 5 / 22';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==3){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 8 / 9 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==4){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 2 / 13 / 10';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==5){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 14 / 13 / 22';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    }
                }  
            } else if(type==6){
                for(var i=0;i<items.length;i++){
                    if(i==0){
                        items[i].style.display = "none";  
                    } else if(i==1){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 2 / 5 / 12';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==2){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 13 / 5 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==3){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 2 / 9 / 12';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==4){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 13 / 9 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==5){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 2 / 13 / 12';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==6){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 13 / 13 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    }
                }  
            } else if(type==7){
                for(var i=0;i<items.length;i++){
                    if(i==0){
                        items[i].style.display = "none";  
                    } else if(i==1){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 2 / 5 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==2){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 9 / 5 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==3){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 16 / 5 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==4){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 2 / 9 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==5){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 9 / 9 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==6){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 16 / 9 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==7){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 2 / 13 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    }
                }  
            } else if(type==8){
                for(var i=0;i<items.length;i++){
                    if(i==0){
                        items[i].style.display = "none";  
                    } else if(i==1){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 2 / 5 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==2){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 9 / 5 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==3){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '1 / 16 / 5 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==4){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 2 / 9 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==5){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 9 / 9 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==6){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '5 / 16 / 9 / 24';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==7){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 2 / 13 / 9';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    } else if(i==8){
                        items[i].style.width = "100%";
                        items[i].style.height = "100%";
                        items[i].style.gridArea = '9 / 9 / 13 / 16';  //7 / 13 / 12 / 26
                        items[i].style.zIndex = 0;
                        items[i].style.border = "1px solid #FFFFFF";
                        items[i].onclick = function (e) { $.setMainVideo(e.currentTarget.id) };
                    }    
                }
            }
        },
    },
    mounted() {

    },
    created() {

    }
};