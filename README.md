# Like_x · 个人工程作品集

公开作者为Like_x。记录电子制作、控制实验与小工具，不包含姓名、专业、学校或联系方式。

网站：https://likex061228-dotcom.github.io/

## 体验与调试

- project.html?project=balance：滚球项目的完整功能、多视角机构观察、控制与视觉延迟实验。
- project.html?project=smartcar：遥控、扫描避障、双路声音方向判断。
- project.html?project=matrix：32×8LED数字珠盘，观察相机和倾斜板子分开操作。
- project.html?project=workflow：六阶段输入、产物、检查与返工路径的交互解释。
- studio.html：项目实验库、PD对比、反馈延迟、死路脱困和本机保存的实验。
- teach.html：嵌入式实验手册。六节实验课涵盖LED、按键消抖、EXTI、NVIC、定时器和PWM，每课包含任务、可修改条件、逐步过程、HAL落地与排错。课程入口与原有32节参考章节并存，另含 C 语言第一课（10 节：计算机基础、基本框架、输出/输入、类型、变量、分支、循环、运算与练习，附 printf 格式实验）。浅色讲义与深色信号区分开。EXTI展示外设PR与NVIC两层挂起，PWM区分引脚高电平比例和低有效LED导通比例。教学模型不执行固件，不计算模拟电压电流。PC0、PC8与PA6采用明确标注的教学接法，上板需核对原理图。浏览记录与操作检查分开，仅保存在当前浏览器。

项目页默认收起调试参数；进入工作台可以带上当前任务、参数和机械状态。支持本机保存、严格校验的JSON导入导出、实际计算CSV和A/B参考曲线。本机实验最多保留20份，新的保存挤掉最旧一份；工作台可以逐条删除并显示剩余容量，删除只改动当前浏览器。关闭页面不会把模型或记录上传。

## 模型与适用范围

三个项目使用明确标注的行为模型，3D显示同一状态，未执行STM32固件、电路或完整3D刚体车辆动力学。参数与结构尺寸未按实物标定。小车按原策略解释定时扫描、转向、后退脱困与300ms声音动作；声音不具备路径规划。LED的“珠子”为显示格点，沙漏不作为计时器。

独立的workbench.html保留MuJoCo3.16.0原生WASM机械求解、MJCF编辑与九项可重算基准，Three.js0.186.1负责渲染。它是高级机械工具，不代替已有项目。physics-guide.html说明引擎、验证依据、假设与限制。当前没有任意自然语言自动生成模型的AI服务。

simulator.html保留旧版二维界面。model-notes.html保留赛题、代码与模型对应说明。网页模型成绩与比赛实测结果分开，省级三等奖为作者提供的信息。

## 项目与源码

| 项目 | 下载 |
|---|---|
| 车载平衡滚球 | balance-source.zip |
| STM32循声避障小车 | smartcar-source.zip |
| LED点阵互动 | matrix-source.zip |
| 数学建模工作流与模板 | mathmodel-workflow.zip |
| 本次交互项目页、模型、测试与构建 | project-experience-source.zip |
| 原生机械工作区源码与测试 | physics-lab-source.zip |

成品文件可直接静态托管。源码包内含依赖锁定与复现说明。本次未重新编译原硬件固件或进行上板测试。原工程的个人IDE状态、编译缓存、聊天和本机资料未发布。

## 隐私与许可

项目配置、实验名称与曲线记录只保存在当前浏览器；JSON和CSV由用户主动导出。无埋点、追踪、云端AI或嵌入API密钥。托管平台可能保留正常服务日志。

Third-party components retain their own licenses: MuJoCo Apache-2.0, Three.js MIT; see MUJOCO-LICENSE.txt and THREE-LICENSE.txt. Individual project sources and templates retain upstream notices; no blanket license is asserted for every file. Exact engine/bundle versions and hashes are recorded in physics-engine-manifest.json and project-experience-manifest.json.
