import {
  Button,
  Option,
  Select,
  Switch,
  MessageBox,
  Message,
  Dialog,
  Table,
  Image,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  InputNumber,
  Loading,
  Avatar,
  Menu,
  Scrollbar,
  MenuItem,
  Submenu,
  RadioGroup,
  Radio,
  RadioButton,
  Upload,
  TableColumn,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Pagination,
  Card,
  Col,
  Carousel,
  CarouselItem,
  Tag,
  Tooltip,
  Link,
  Badge,
  InfiniteScroll,
  Popover,
  Cascader
} from "element-ui";
const element = {
  install: function(Vue) {
    Vue.use(Button);
    Vue.use(InfiniteScroll);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Dialog);
    Vue.use(Table);
    Vue.use(Image);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Loading);
    Vue.use(Avatar);
    Vue.use(Menu);
    Vue.use(MenuItem);
    Vue.use(Submenu);
    Vue.use(Upload);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(RadioButton);
    Vue.use(TableColumn);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(DatePicker);
    Vue.use(Pagination);
    Vue.use(Tooltip);
    Vue.use(Col);
    Vue.use(Tag);
    Vue.use(Link);
    Vue.use(Card);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Scrollbar);
    Vue.use(Badge);
    Vue.use(Popover);
    Vue.use(Cascader);

    // 往vue实例原型里添加消息提示，方便全局调用
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$message = Message;
    //使用：this.$message('这是一条消息提示');
  }
};
export default element;
