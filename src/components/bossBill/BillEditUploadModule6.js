import React from 'react';
import Utils from '../../common/utils';
import {Refers} from 'ssc-refer';
import {Grid} from 'ssc-grid';
import {DatePicker2} from 'ssc-grid';
import {Modal, Button,Pagination} from 'react-bootstrap';
import _ from 'lodash';
import Config from '../../config';
import globalStore from '../../stores/GlobalStore';
import FileUpload from '../bossBill/Upload';
import BossStore from '../../stores/bossBill/BossBillStore';
const store = new BossStore();

/**
 * 拍照上传收货单，录入出货信息
 * */

export default class BillEditUploadModule2 extends React.Component {
    constructor(props){
        super(props);
        this.state={
            pic:[{num:"",url:"",id:"",out_ts:""}],
            saveResult:'', // 保存结果
        }
    }

    componentWillReceiveProps= (props) =>{
        if(props.deliverData){
            this.getEditData(props.deliverData)
        }
    }

    getEditData =( data )=>{
        if(data.delivers && data.delivers.length>0){
            this.setState({
                pic:data.delivers
            })
        }
    }

    addSizeModal = () =>{
        let pic = this.state.pic;
        let newPic = {"id":new Date().getTime()}
        pic.push(newPic);
        this.setState({
            pic
        })
    }

    uploadEvent =(data)=>{
        let pic =this.state.pic ;
        pic.forEach((m,n)=>{
            if(m.id == data.id ){
                m.url = data.img_url
            }
        })
        this.setState({pic})

    }

    setInput =(id,e) =>{
        let pic =this.state.pic ;
        pic.forEach((m,n)=>{
            if(m.id == id ){
                m.num = e.target.value ;
            }
        })
        this.setState({pic})
    }

    setTime=(id,value, formattedValue)=>{
        let pic =this.state.pic ;
        pic.forEach((m,n)=>{
            if(m.id == id ){
                m.out_ts = formattedValue ;
            }
        })
        this.setState({pic})
    }


    saveModule6 =()=>{
        let pic = this.state.pic ;
        let that = this;
        let result = [];
        pic.forEach((m,n)=>{
            result.push({"num":m.num , "url": m.url,"out_ts":m.out_ts})
        })
        let param ={
            'order_id':this.props.orderId ,
            'delivers':result
        }
        store.saveDeliver(param,()=>{
            let saveResult = "保存成功!";
            this.setState({
                saveResult
            },()=>{
                setTimeout(()=>{
                    that.setState({
                        saveResult:""
                    })
                },3000)
            })

        })

    }
    //修改上传
    updateFileUpload = (index) =>{
        let pic = this.state.pic ;
        pic[index].url ="";
        this.setState({
            pic
        })
    }
    render(){
        let that = this ;
        return (
            <div className="stdreimburse-box ">
                <h3 className="b-title">6、拍照上传收货单，录入出货信息<Button className="ml50" onClick={this.addSizeModal}>新增出货记录</Button></h3>
                <div className="row">
                    {this.state.pic.map((m,n)=>{
                        m.id=m.id||new Date().getTime();
                        return (
                            <div className="col-md-6 mt15">
                                <div className="b-upload-box col-md-6">
                                    <p className="b-upload-box-tag">{n+1}</p>
                                    {m.url ?(<img src={Config.serverUrl+m.url} className="b-upload-pic" onClick={this.updateFileUpload.bind(this,n)}/>) :(
                                        <FileUpload ref="fileUpload" id={m.id} successCallBack ={this.uploadEvent}/>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <div className="row b-edit">
                                        <div className=""  style={{"height":"50px"}}>
                                            出货数量：
                                            <input type="text" value={m.num} placeholder="出货数量" onChange={this.setInput.bind(this,m.id)} className="b-input mt10 ml5 w200"/>
                                        </div>
                                        <div className="" style={{"height":"50px"}}>
                                            出货时间：
                                            <DatePicker2 id={ "example-datepicker" +n } className="b-input ml5 w200"
                                                         dateFormat="YYYY-MM-DD" value={m.out_ts} onChange={this.setTime.bind(this,m.id)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )

                    })}

                </div>
                <div className="row b-center">
                    <p className="error">{this.state.saveResult}</p>
                    <Button bsStyle="warning" onClick={this.saveModule6}>保存</Button>
                </div>

            </div>
        )
    }


}