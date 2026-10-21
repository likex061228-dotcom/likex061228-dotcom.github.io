# Like_x · 个人工程作品集

记录电子制作、控制实验与小工具的个人项目档案。采用深色仪器台视觉风格，纯 HTML / CSS / JavaScript，无需构建，无第三方字体、统计或追踪脚本。作品集提供轻量功能展示，独立实验室提供调参和场景编辑；演示不连接实物，也不运行原固件。

网站：https://likex061228-dotcom.github.io/

## 项目与源码
| 项目 | 内容 | 下载 |
| --- | --- | --- |
| 车载平衡滚球系统 | STM32F407、MaixCAM、PD 控制与循迹；河北省电子设计竞赛 H 题，省级三等奖 | [源码包](balance-source.zip) |
| 循声避障小车 | STM32F103、蓝牙遥控、超声波避障与实验性双麦克风方向判断 | [源码包](smartcar-source.zip) |
| LED 点阵互动 | MPU6050、MAX7219、8×32 点阵与光点运动 | [源码包](matrix-source.zip) |
| 数学建模工作流 | 分阶段技能与文本模板，从分析建模到撰写和验收 | [源码包](mathmodel-workflow.zip) |

每个源码包内有独立说明和目录导航。保留原工程依赖中的上游许可声明。此整理版本未重新编译固件或进行硬件验证；页面中的工程图为概念示意，不是实测结果。部分模板引用的非文本图片需按包内说明另行准备。

## 维护网页
- index.html：页面内容与结构。
- styles.css：布局、颜色和手机适配。
- app.js：项目详情、标签页、筛选与演示生命周期。
- lab-models.js：简化物理、几何、点阵与工作流数据。
- lab-ui.js：动画与界面公共工具。
- balance-lab.js：单端固定水管、步进曲柄连杆、上方摄像头与底盘结构。
- project-labs.js：小车、点阵、工作流交互。
- labs.css：交互实验台布局与手机适配。
- 四个 ZIP：经过整理的项目源码快照。

更新文件提交至 main 后，GitHub Pages 从根目录发布。仅上传本目录中的成品文件；不需要上传原工程缓存、个人资料、聊天、证书、运行日志或本机配置。

## 隐私与许可
公开作者为 Like_x；不包含个人联系方式、学校、学号或本机路径。页面不收集访问者资料；托管平台自身可能有正常的服务日志。第三方源码及模板适用其原有许可；未为全部内容统一指定开源许可。

## 嵌入式项目仿真实验室

[进入平台](simulator.html)。支持车载滚球（静止、直行加减速、整圈循迹）、传感器驱动的小车行为、具有惯性与弹跳的LED点阵。提供运行/暂停/单步、时间倍率、参数调节、信号曲线、局部场景编辑及本机JSON导入导出。

这是可编辑的项目级行为模型，不执行C代码或固件，不模拟电路电气特性。默认模型参数不是实测辨识结果。新增文件：sim-engine.js（物理与行为模型）、simulator.js（交互与绘图）、simulator.css 和 simulator.html。保存场景只写入浏览器本地存储，导出只包含允许的参数及场景对象。


## 2026-10-21 refinement
Portfolio now uses curated feature demonstrations; parameters, scene editing and signals belong to the standalone laboratory. Exact major removed. See model-notes.html for source-to-model coverage, limitations and design references. H course uses two 1.5 m straights and two R0.5 m semicircles, with task presets 2–6. Matrix initialization and light tap counts vary. No real hardware certification or firmware execution is claimed.
