import AgoraRTM from "agora-rtm-sdk";
class RMT {
  constructor({
    addId,
    isGroup,
    isErp,
    linkName,
    orgLinkName,
    orgCompanyID,
    uid,
    orgUserID,
    orgUserImage,
    userImage,
    msgType,
    value,
    attachment,
    token,
    loginState,
    showmsg,
    orderNumber,
    creatChannel,
    groupNumber,
    toCompanyID,
    toUserID,
    client,
    channelMember
  }) {
    this.addId = addId || "5de91f02f12c41c2b276c9accb4679c7";
    this.isGroup = isGroup || false; // 是否群聊
    this.msgType = msgType || "Text"; // 消息类型默认文本
    this.value = value || ""; // 发送的消息内容
    this.attachment = attachment; // 发送的消息文件图片语音等内容
    this.token = token || null;
    this.uid = uid;
    this.isErp = isErp || false;
    this.loginState = loginState;
    this.showmsg = showmsg; // 聊天信息集合
    this.orderNumber = orderNumber;
    this.creatChannel = creatChannel;
    this.groupNumber = groupNumber; // 聊条产生的groupNumber
    this.toLinkName = linkName || ""; // 接收人名字
    this.toUserImage = userImage || null; // 接收人头像
    this.toCompanyID = toCompanyID; // 接收人公司id
    this.toUserID = toUserID; // 接收人id
    this.orgCompanyID = orgCompanyID; // 发送人公司id
    this.orgUserID = orgUserID; // 发送人id
    this.orgLinkName = orgLinkName; // 发送人名字
    this.orgUserImage = orgUserImage; // 发送人头像
    this.client = client;
    this.channelMember = channelMember;
    this.AgoraRTM = AgoraRTM;
    this.videoTrackObject = null;
    this.localAudioTrack = null; // 用来放置本地音频轨道对象
    this.localVideoTrack = null; // 用来放置本地视频频轨道对象
  }

  // 深网登录
  login(uid, userName, callback) {
    this.userName = userName;
    // 登入 RTM 之前，调用 AgoraRTM.createInstance 方法创建一个 RtmClient 实例。
    this.client = this.AgoraRTM.createInstance(this.addId);
    // 通过监听 RtmClient 上的 ConnectionStateChanged 事件可以获得 SDK 连接状态改变的通知
    this.client.on("ConnectionStateChanged", newState => {
      this.loginState = newState;
    });
    // 登录
    this.client
      .login({
        token: this.token,
        uid: uid
      })
      .then(() => {
        console.log("AgoraRTM客户端登录成功");
      })
      .catch(err => {
        console.log("AgoraRTM客户端登录失败", err);
      });
    // 监听 client 上的事件 MessageFromPeer 接收点对点消息
    this.client.on("MessageFromPeer", () => {
      // text 为消息文本，peerId 是消息发送方 User ID
      console.log("我收到了点对点", 123);
      callback();
      /* 收到点对点消息的处理逻辑 */
    });
    // 监听对方是否在线
    this.client.on("PeersOnlineStatusChanged", status => {
      console.log(status);
    });
  }

  // 创建音视频实例
  // async startBasicCall () {
  //   // 创建本地客户端
  //   this.videoTrackObject = this.AgoraRTM.createClient({ mode: 'rtc', codec: 'vp8' })
  //   // 加入频道
  //   const uid = await this.videoTrackObject.client.join(this.addId, this.groupNumber, this.token, null)
  //   // 创建并发布本地音视频轨道
  //   // 通过麦克风采集的音频创建本地音频轨道对象。
  //   this.videoTrackObject.localAudioTrack = await this.AgoraRTM.createMicrophoneAudioTrack()
  //   // 通过摄像头采集的视频创建本地视频轨道对象。
  //   this.videoTrackObject.localVideoTrack = await this.AgoraRTM.createCameraVideoTrack()
  //   // 将这些音视频轨道对象发布到频道中。
  //   await this.videoTrackObject.client.publish([this.videoTrackObject.localAudioTrack, this.videoTrackObject.localVideoTrack])
  //   this.videoTrackObject.client.on('user-published', async (user, mediaType) => {
  //     // 开始订阅远端用户。
  //     await this.videoTrackObject.client.subscribe(user, mediaType)
  //     console.log('subscribe success')
  //     // 表示本次订阅的是视频。
  //     if (mediaType === 'video') {
  //       // 订阅完成后，从 `user` 中获取远端视频轨道对象。
  //       const remoteVideoTrack = user.videoTrack
  //       // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
  //       const playerContainer = document.createElement('div')
  //       // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
  //       playerContainer.id = user.uid.toString()
  //       playerContainer.style.width = '640px'
  //       playerContainer.style.height = '480px'
  //       playerContainer.style.position = 'fixed'
  //       playerContainer.style.left = '50%'
  //       playerContainer.style.top = '50%'
  //       playerContainer.style.transform = 'translate(-50%, -50%)'
  //       document.body.append(playerContainer)
  //       // 订阅完成，播放远端音视频。
  //       // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
  //       remoteVideoTrack.play(playerContainer)
  //       // 也可以只传入该 DIV 节点的 ID。
  //       // remoteVideoTrack.play(playerContainer.id);
  //     }
  //     // 表示本次订阅的是音频。
  //     if (mediaType === 'audio') {
  //       // 订阅完成后，从 `user` 中获取远端音频轨道对象。
  //       const remoteAudioTrack = user.audioTrack
  //       // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
  //       remoteAudioTrack.play()
  //     }
  //   })
  // }

  // 深网登出
  signOut() {
    if (this.client) {
      this.client.logout();
      console.log("退出頻道成功");
    }
  }
}

export default RMT;
