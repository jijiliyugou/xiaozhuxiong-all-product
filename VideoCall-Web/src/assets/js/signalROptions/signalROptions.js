import AgoraRTM from "agora-rtc-sdk-ng";
// import { Message } from "element-ui";
class RMT {
  constructor({ groupNumber, token, uid }) {
    this.addId = "5de91f02f12c41c2b276c9accb4679c7";
    this.uid = uid || null;
    this.groupNumber = groupNumber;
    this.token = token || null;
    this.AgoraRTM = AgoraRTM;
    this.client = null; // 视频通话实例对象
    this.localAudioTrack = null; // 用来放置本地音频轨道对象
    this.localVideoTrack = null; // 用来放置本地视频频轨道对象
  }
  // 创建音视频实例
  async startCall() {
    // 创建本地客户端
    this.client = this.AgoraRTM.createClient({
      mode: "rtc",
      codec: "vp8"
    });
    // 加入频道
    const uid = await this.client.join(
      this.addId,
      this.groupNumber,
      this.token,
      this.uid
    );
    console.log("加入频道成功，我的id为：" + uid);
    this.localAudioTrack = await this.AgoraRTM.createMicrophoneAudioTrack();
    this.localVideoTrack = await this.AgoraRTM.createCameraVideoTrack();
    await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
  }
  /**
   * 将客户端事件的回调添加到控制流
   * @param {*} client
   * @param {*} streamList
   */
  subscribeStreamEvents() {
    // 开启双流模式
    this.client
      .enableDualStream()
      .then(() => {
        console.log("开启双流模式成功!");
      })
      .catch(err => {
        console.log(err);
      });
    this.client.setRemoteVideoStreamType();
    this.client.on("connection-state-change", (curState, revState) => {
      console.log(curState, revState);
    });
    this.client.on("stream-added", function(evt) {
      let stream = evt.stream;
      let id = stream.getId();
      console.log(stream, id, evt);
    });

    // 当同伴离开时
    this.client.on("peer-leave", function(evt) {
      let id = evt.uid;
      console.log(id, evt);
    });

    // 订阅流时
    this.client.on("stream-subscribed", function(evt) {
      let stream = evt.stream;
      console.log(stream, evt);
    });

    // 删除流时
    this.client.on("stream-removed", function(evt) {
      let stream = evt.stream;
      let id = stream.getId();
      console.log(id, evt);
    });

    // 开始订阅远端用户。
    this.client.on("user-published", async (user, mediaType) => {
      // 接收端，订阅成功后设置回退策略为2
      this.client.setStreamFallbackOption(user.videoTrack, 2);
      await this.client.subscribe(user, mediaType);
      console.log("订阅成功");
      // 表示本次订阅的是视频。
      if (mediaType === "video") {
        // 订阅完成后，从 `user` 中获取远端视频轨道对象。
        const remoteVideoTrack = user.videoTrack;
        // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
        const playerContainer = document.createElement("li");
        // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
        playerContainer.id = user.uid.toString();
        playerContainer.className = "item";
        playerContainer.style.width = "300px";
        playerContainer.style.height = "300px";
        playerContainer.style.margin = "10px";
        document.getElementById("homeBox").appendChild(playerContainer);
        // document.body.append(playerContainer);
        // 订阅完成，播放远端音视频。
        // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
        remoteVideoTrack.play(playerContainer);
        // 也可以只传入该 DIV 节点的 ID。
        // remoteVideoTrack.play(playerContainer.id);
      }
      // 表示本次订阅的是音频。
      if (mediaType === "audio") {
        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
        const audioTrack = user.audioTrack;
        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
        audioTrack.play();
      }
    });
    this.client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        // 获取刚刚动态创建的 DIV 节点。
        const playerContainer = document.getElementById(user.uid.toString());
        // 销毁这个节点。
        playerContainer.remove();
      }
    });
  }

  // 离开频道
  async leaveCall() {
    // 销毁本地音视频轨道。
    this.localAudioTrack.close();
    this.localVideoTrack.close();
    // 遍历远端用户。
    this.client.remoteUsers.forEach(user => {
      // 销毁动态创建的 DIV 节点。
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });
    // 离开频道。
    await this.client.leave();
  }
}
export default RMT;
