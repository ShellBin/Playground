# ThinkPad X61 的 CPU 升级小记
## 介绍
ThinkPad X61 毫无疑问是一台经典的电脑；它和 T61 是联想制造的最后一代还在使用 4:3 屏幕的 ThinkPad。我在 2010 年买了台二手的 X61s（因为在 2007 年它刚发售时我根本买不起它）来作为主力笔电使用（尽管大多数时候我都会用性能更胜一筹的台式机）。在后来，我陆陆续续对它的很多部件都进行了升级：DDR2 内存从 2GB 升级到 6GB、160GB 的传统机械硬盘也升级到 512GB 的固态硬盘、TN 显示屏也由 AFFS（IPS） 取代。一直到今天，只有处理器没有被升级了：一颗 65nm 的 Core 2 Duo L7500。  

 在售时购买全新 X61 可选配的 CPU 如下：  
 X61：
* Core 2 Duo T7100、1.8 GHz，2 MB L2，FSB 800、65 nm，35 W
* Core 2 Duo T7250、2.0 GHz，2 MB L2，FSB 800、65 nm，35 W
* Core 2 Duo T7300、2.0 GHz，4 MB L2，FSB 800、65 nm，35 W
* Core 2 Duo T8100、2.1 GHz，3 MB L2，FSB 800、45 nm，35 W
* Core 2 Duo T8300、2.4 GHz，3 MB L2，FSB 800、45 nm，35 W
* Core 2 Duo T9300、2.5 GHz，6 MB L2，FSB 800、45 nm，35 W

X61s：  
* Core 2 Duo L7300、1.4 GHz，4 MB L2，FSB 800、65 nm，17 W
* Core 2 Duo L7500、1.6 GHz，4 MB L2，FSB 800、65 nm，17 W
* Core 2 Duo L7700、1.8 GHz，4 MB L2，FSB 800、65 nm，17 W

但在选购二手的时候，尤其是当下2020年，已经很难买到特定处理器型号的 X61，线上在售的机型所配备的处理器多数都是 65 nm 工艺的 T7100 或 T7300。如果想要买 X61s 的话，65 nm 的处理器几乎是唯一的选择。  

除非可以自行升级 CPU。  

给 T61s 更换处理器也是非常平常的事情，只需要购买一个兼容的处理器在主板上安装妥当即可，而如果是想要使用 FSB 1066 或者四核处理器，也不过是需要修改 BIOS 再改装主板而已。 

在 X61 上完成同样的升级可就没这么易行了，其焊接在主板上的处理器使处更换变得非常困难，而 BGA 处理器的购买也要比购买普通的 PGA 处理器困难许多：无论是拆机片还是这样的老型号全新片都很难买到。好在师出同门，如果真的买来这种 CPU 还想办法成功装机了，那些给 T61 用的 BIOS 修改方案和主板改装方案在 X61 上也是可以继续使用的。  

这是一篇讲述如何在供电和散热允许的前提下，将任何 Core 2 Duo 移动处理器安装到 X61 的全面说明。而且这篇教程使用易得的 PGA 封装处理器，而不是那些在 eBay 或其他平台上都很难买到的 BGA 处理器。但要注意，四核处理器的发热问题非常严重，而本文并不涵盖因解决散热问题而可能需要的 ACPI 修改。  

这类的改装过去已在 X61 上完成过很多次。但我只想全面记录我的操作方式以及每个步骤的内容。  

我也知道 X62 / X63 主板项目的存在。它们只专注于升级原来的主板。  

本文以更换到 P8600 为例，如果使用其他型号的处理器也是可行的。  

所有的信息均“原样”提供。如因使用或误用所提供的资料而造成的任何损失，本人概不负责。改装硬件和 BIOS 软件存在风险，如果操作不当，可能会永久损坏计算机。这样做您需要自担风险。  
（译者注：因阅读书写能力和翻译经验受限，我的翻译不可能完全准确。如果哪里读不通的话，请不要主观猜测盲目操作，参考一下原文或许可以解决问题）

## 你需要什么
* 需要改装的 X61 或 X61s
* Merom 或 Penryn Socket P 处理器
* PC，Windows + MinGW/MSYS 或直接使用 Linux，用于修改 BIOS
* 非 ThinkPad 的 DDR2 笔记本电脑，用于刷入 SPD
* 吸锡线
* BGA 助焊剂（RMA-233或类似的东西）
* 带有预热台的 35mm * 35mm 风嘴焊台
* BGA 478 / 479 钢网
* 0.5mm 锡珠（其他尺寸应该也可以）
* 植球台或其他耐热的 PCB 夹具
* 479 中介层连接器，如果没有这个小东西可以下载我下面提供的文件来找 PCB 板厂打样制作

## BIOS 修改
BIOS 依赖目标 CPU 的微码，微码则与 CPUID 是绑定的。换句话说，BIOS 需要具有与所安装 CPU 的 CPUID 匹配的微码，电脑才可以工作。如果有条件在其他的机器上测试准备更换的新 CPU（例如 T400），则可以用 AIDA64 来检查其 CPUID。不然，也可以在 http://www.cpu-world.com/CPUs/CPU.html 上找到你的 CPUID，但同一型号不同步进的 CPU 的 CPUID 可能不同。  

例如，T7300的CPUID为6FA：  
<!-- ![avatar](https://www.zephray.me/api/media/1597503870765-aida64cpuid.png) -->

以下是一些常见的参考：

* 6FA：Core 2 Duo L7500，Core 2 Duo T7300
* 6FD：Core 2 Duo U7500，Core 2 Duo T7100
* 10676：Core 2 Duo P8600，Core 2 Duo T9600，Core 2 Extreme X9100
* 1067A：Core 2 Duo P8600，Core 2 Duo P9700，Core 2 Duo T9600，Core 2 Quad Q9100

通常，要使用常见的 T9x00，P8x00 或 P9x00 处理器，其微码通常是 10676 和 1067A。针对它们修改后的 BIOS 在网上也可以找到。

## 检查已存在的微码补丁
本节介绍如何检查当前 BIOS 中已安装的微码补丁。如果 BIOS 已经存在所需微码，就不用对 BIOS 进行进一步的修改了。  

必须有一个完整的 BIOS dump，而从联想官网下载的 BIOS 升级包则不能直接使用。可以用 phlash16 和以下命令来获得完整 BIOS 备份。  

`PHLASH16 /RO=X61BAK.ROM BIOS.WPH`

值得一提的是，即便你只让它进行备份，但它还是需要一个 BIOS 升级文件才行，但这个升级文件不一定必须是有效的升级文件。不知道为什么，在我这里 WinPlash 不能正常工作，会被提示备份已损坏。而且 WinPlash 只支持的 32 位操作系统也越来越不那么常用，所以不妨直接制作一个 USB-DOS 启动盘来完成这项工作，用 Rufus 就可以创建可引导 FreeDOS 或 MS-DOS U盘。  

完整该步骤后，打开 intelmicrocodelist.exe，将 BIOS 的完整备份拖放到 CMD 窗口中然后按回车，屏幕上会显示所有已经存在的微码补丁。
<!-- ![avatar](https://www.zephray.me/api/media/1597455960257-image_2020-07-24_21-19-56.png) -->

这是我的 X61 已拥有的微码补丁，这里它缺少 1067A 的微码补丁，这意味着 P8x00 或 P9x000 一类较新步进的处理器就用不了了。iMac 的 Core 2 Duo E8xxx 也将无法使用。如果恰好已经支持该处理器（大多数为10676），则不需要修改 BIOS。跳至安装处理器的步骤继续阅读即可。

## 获得微码更新
### 方法1：从 Intel 的 Linux 微码补丁中获得

在 2018 年 4 月之前，可以从英特尔官网获取 microcode.dat。但在后来他们一直改变微码文件的格式。在 2018 年 4 月之前获得历史微码更新的一种方法是使用针对 Linux 发行版打包的版本，例如 Ubuntu：

https://launchpad.net/ubuntu/+source/intel-microcode/3.20180108.0~ubuntu14.04.2

microcode-yyyymmdd.dat 文件就是微码补丁了。可以用 microcode.exe 将其转换为单个二进制微码补丁：
<!-- ![avatar](https://www.zephray.me/api/media/1597466438541-20200815004551.png) -->

解压缩这些文件。现在应该有大量单个的 .bin 二进制文件。

### 方法2：从 BIOS 中提取
从已有的 BIOS dump文件中提取微码补丁也可以。使用相同的 intelmicrocodelist.exe，它可以帮你找到所有微码补丁程序在文件的哪里，使用 dd 命令将他们提取到单个的文件中即可。
<!-- ![avatar](https://www.zephray.me/api/media/1597506111544-20200815114503.png) -->

似乎这里包含的微码补丁比 Linux 补丁还要新，我不确定这是为什么。

## 从 BIOS 提取微码模块
可以使用 phoenixtool 来从 BIOS 中提取微码模块，将 ROM 文件以 Original 方式打开。它应该可以自动提取并保存模块到名为 DUMP 的文件夹中。
<!-- ![avatar](https://www.zephray.me/api/media/1597464279443-20200815000859.png) -->

在 X61 上，UPDATE.ROM 已经包含微码补丁。可以使用 intelmicrocodelist.exe 进行验证：
<!-- ![avatar](https://www.zephray.me/api/media/1597466584965-20200815004811.png) -->

请注意，微码不是从 0 偏移量开始的，但会在文件的末尾结束。这意味着文件的开头还包含其他内容，不过将更多微码附在文件中应该是安全的。

## 组装新的微码模块
此步骤将会向 X61 的 UPDATE.ROM 中添加缺少的微码。

首先，提取微码模块的标头，以便之后可以在标头后追加新的微码。
<!-- ![avatar](https://www.zephray.me/api/media/1597501039631-20200815102240.png) -->

然后就可以将微码补丁用 cat 命令添加到 UPDATE0.ROM 中了。我添加了 6FA、6FD、10676 和 1067A，这应该已经涵盖了所有 MP 步进 Merom 和 Penryn 处理器。但如果处理器是 ES 版或早期步进版，则还需要添加其他一些对应微码补丁。

用 cat 命令将微码补丁追加到新的 UPDATE0_TARGET.ROM 的末尾方法如下所示：

```shell
#!/bin/sh
cat microcode/cpu000006fa_plat00000080_ver00000095_date20101002.bin >> UPDATE0_TARGET.ROM
cat microcode/cpu000006fd_plat00000080_ver000000a4_date20101002.bin >> UPDATE0_TARGET.ROM
cat microcode/cpu00010676_plat00000080_ver0000060f_date20100929.bin >> UPDATE0_TARGET.ROM
cat microcode/cpu0001067a_plat000000a0_ver00000a07_date20080409.bin >> UPDATE0_TARGET.ROM
```
这样就完成了。

## 更换 BIOS 中的微码模块
此步骤的目的是用刚刚新组装的新微码模块替换 BIOS 中的原始微码模块。

打开 PhoenixTool 2.52 utility，选择 X61 的 BIOS dump 并等待软件解包 BIOS。在 Manufacturer field 中选 Lenovo，然后选中“Allow user to modify other modules”和“No SLIC”。
<!-- ![avatar](https://www.zephray.me/api/media/1597507683862-20200815120531.png) -->

点击 “Go”，然后等待修改模块的提示。
<!-- ![avatar](https://www.zephray.me/api/media/1597507688694-20200815120554.png) -->

这一步时候，不要急着点击 OK。转到 DUMP 目录，删除旧的 UPDATE0.ROM 并在其中放置新的 UPDATE0.ROM。完成后，单击 OK。应该会在此文件夹创建一个叫做 X61BAK_SLIC.ROM 的新文件。这里你可以再用 intelmicrocodelist.exe 检查一下是不是真的包含了需要的微码补丁。也可以使用 phoenixtool 重新打开 ROM，来确保有效的 SLIC 还在。

## 刷入新 BIOS
将刚刚新的 BIOS 文件复制到 DOS 启动盘，我这里把它重命名为 X61MOD.ROM。

这样，在 DOS 下，用以下命令就可以刷入 BIOS 了：

`phlash16.exe X61MOD.ROM /C`

/C 参数表示使 CMOS 设置校验和无效。这样所有 COMS 设置会恢复默认值，我觉得应该没什么问题。

它可能会提示 Extended Checksum is not zero，扩展校验和不为零。不过我不知道这种情况要怎么解决。但按 Y 忽略该错误并等一分钟，BIOS 还是会成功刷入的。

<!-- ![avatar](https://www.zephray.me/api/media/1597508442614-photo_2020-08-15_12-24-53.jpg) -->

重启电脑，希望没砖。就我而言，确实如此。

## 安装新 CPU
### 选择合适的处理器
通常，尝试使用有 6MB L2 的 Penryn 处理器。

对于最初标配 35W 处理器的 X61 而言，可以选择例如 T9x00 这样的任何 35W Core 2 Duo 处理器，不过 T9900 这种高频处理器的价格也十分的感人。

而对于 X61s，它的散热方案只够 17W 处理器使用，而 45nm 低功耗平台的芯片组和处理器的封装都与之不能兼容，所以放弃。下一个低功耗的选择是 25W TDP 的 P 系列处理器，P8x00处理器备有 3 MB 的 L2，而 P9x00 处理器则有 6 MB 的 L2。

我以 PGA Core 2 Duo P8600 为例。

## 移除处理器的针脚
PGA 是有用于连接到插座的针脚的。不过上面所有的针脚也只是焊接到处理器而已，所以可以用烙铁将针脚们脱焊接，这样就可以像 BGA 一样直接焊接到主板上了
<!-- ![avatar](https://www.zephray.me/api/media/1597538355815-IMG_1695.jpg) -->

警告：这一步骤（显然）是不可逆的。以后就不能在普通的 Socket P PGA 主板上安装这颗处理器了。

引脚全部拆下来后，记得用吸锡线清洁一下焊盘。右上角已经清洁完成，其他区域还没有清洁。
<!-- ![avatar](https://www.zephray.me/api/media/1597537423696-p8400pads.jpg) -->

但是到这一步结束，它还不能真的当做普通 BGA 处理器使用，它所有的焊盘都大于正常 BGA 处理器的焊盘，当你进行植球的时候会发现锡珠们只会熔化成为小圆顶而不是焊球。这些小圆顶还没有处理器中间的那些电容高，所以不能与主板接触并焊接妥当。

有几种解决这个问题的方案：

1. 不脱焊那些针脚直接焊在主板上。我觉得这样不太行得通，而且最终高度也可能过高。
2. 在植球时使用比较大的锡珠。虽然 0.76mm 很小，但已经是钢网可用的最大锡珠了，不过仍有可能可以通过植珠两次的方法解决问题。
3. 在主板和处理器间通过转接板（之前提到的中介层连接器）相连，作为支架还能避免处理器上的电容碰到主板。

我采用第三种方案，不过我没试过第一种方案的确切可行性，也同样不确定方案二会不会导致短路。

## 转接板
只是一个有着大缺口，478针直接相连的电路板。
<!-- ![avatar](https://www.zephray.me/api/media/1597539727917-20200815210710.png) -->

理想状态下，应该选择 0.4mm 的板材，但这样会比 0.6mm 的板材贵得多，所以我选用了 0.6mm 的那种。收到电路板后，像芯片一样给他们植球就好（虽然说是双面的）。

再提一句，我要在这块电路板上植球而不是直接用 CPU 压上去。

可在 https://github.com/zephray/Pants479 上获得该板的KiCAD源文件。

## 拆下旧 CPU
将电路板预热到 140度，然后用 350度到420度的热风枪加热芯片一至两分钟，然后应该就可以拆下来了。
<!-- ![avatar](https://www.zephray.me/api/media/1597541450117-IMG_1694.jpg) -->

不要忘记清理主板上的焊盘

## 焊接新 CPU
没什么特别的，不过记得先把转接板焊在主板上，再将CPU焊在转接板上，然后要一直向板上施加助焊剂
<!-- ![avatar](https://www.zephray.me/api/media/1597541441797-IMG_1693.jpg) -->

和之前一样，将预热台设置到 140度左右，然后用 350度的热风枪吹一至两分钟，如果选用含铅的锡珠，温度可以稍微低一些。
<!-- ![avatar](https://www.zephray.me/api/media/1597541728806-IMG_1763.jpg) -->

这样，新处理器就焊接成功了

## 改装主板
这个时候，主板还不能启动。要在 T61 / X61 上引导 FSB1066 处理器，只有正确的微码补丁还是不够的。如果 BIOS 检测到 266MHz 外频的处理器就不能开机。所以需要欺骗北桥，使其相信安装的 CPU 是200MHz 外频的。

主板通过 BSEL (FSB_Sense) 引脚检测处理器的外频。在 Socket P 和Socket LGA775 平台上有 3 条 BSEL 线，其组合定义如下：

|BSEL2|BSEL1|BSEL0|Base Clock|
|:----|:----|:----|:----|
|0|0|0|266MHz|
|0|0|1|133MHz|
|0|1|0|200MHz|
|0|1|1|166MHz|
|1|0|0|333MHz|
|1|0|1|100MHz|
|1|1|0|400MHz|
|1|1|1|Invalid|

从表中可以看到，主板期望收到 010 信号（200MHz），但是处理器提供 000 信号（266MHz），导致启动失败。

X61的电路图指明了连接方式：
<!-- ![avatar](https://www.zephray.me/api/media/1597545577444-20200815224454.png) -->

BSEL 信号来自 CPU，进入第 10 页和 18 页。
<!-- ![avatar](https://www.zephray.me/api/media/1597546039025-20200815225203.png) -->

在第 10 页上，这些信号通过 R108，R112 和 R117 连接至北桥。
<!-- ![avatar](https://www.zephray.me/api/media/1597546146284-20200815225427.png) -->

在第18页上，这些信号通过 R830 和 R785 到达 PLL 芯片（时钟芯片）

我想要实现的是，让北桥认为处理器是 200MHz，而时钟芯片认为处理器是 266MHz。这样就可以在 266MHz 的外频下顺利开机了。为此，北桥应该可以收到 010，而 PLL 应该收到 000。

在这款主板上想要实现这样的效果非常简单，直接将这两点用飞线连接就好，这样就可以在北桥侧上拉 BSEL1 了。
<!-- ![avatar](https://www.zephray.me/api/media/1597619904533-IMG_1765_LI.jpg) -->

飞线完成。没意外这个时候开机就可以顺利点亮了。

## 修改 SPD
如果上一步没成功启动，应该是因为内存被过度超频所致。因为北桥认为时钟为 200MHz，因此在配置分频器时会按照原样去设置。而事实上整个系统的时钟都高了 33%。比方说内存应该在 DDR2-667 运行，这时就会在 DDR2-888 运行了。虽然 888MT / s 对于 DDR2 内存还不过分（后期的 DDR2 内存可以达到 1066MT / s），但这里 DDR2.-667 的情况有所不同。

许多 DDR2-667 内存条的额定 CAS 延迟为 5，相当于 1s / 667MHz * 5 = 7.49ns。而许多 DDR2-800 内存条的额定 CAS 延迟为 6，相当于 1s / 800MHz * 6 = 7.5ns。而对于内存而言，无论传输速率有多快，延迟都可以改变。但是由于北桥和 BIOS 认为它在 DDR2-667 上运行，因此将 CL 设置为 5。该内存最终在 DDR2-888 上运行 CL 5，实际的 CAS 延迟为 5.6ns。在这种情况下，没有多少内存条还能正常可靠工作。

解决方案是修改 SPD。 SPD 是内存条上存储内存时序配置信息的地方。修改SPD，将其改为自身报告为类似 CL2-5 的 DDR2-533。然后，BIOS 将会将频率设置为 DDR2-533，CL 设置为 5。由于实际频率高出 33％，因此内存将以 CL = 5 的 DDR2-708运行。虽然还是超频了，不过通常运行的很好。

修改 SPD 需要在其他非 ThinkPad DDR2 上完成，下面会进行介绍。

## 备份 SPD

将内存安装到非 ThinkPad DDR2 笔记本电脑中。因为 ThinkPad 不允许从操作系统写入 SPD。这项任务我是用华硕 EeePC 来完成的。
<!-- ![avatar](https://www.zephray.me/api/media/1597590549081-IMG_1788.jpg) -->

用 RW everything 一类的软件备份 SPD 并保存为二进制格式。

## 自定义 SPD

我使用 SPDTool 0.63 来修改 SPD，通常，以 DDR2-667 5-5-5-15 到 DDR2-533 5-5-5-15 的时序为例，是一个很好的起点。更改属性如下：

* SDRAM Cycle time at Maximum Supported CAS Latency: 3.75 ns (267 MHz) (原为 3.00 ns 333 MHz)
* CAS Latencies Supported: 5 (原为 3, 4, 5)
* Minimum Row Precharge Time (tRP): 17.5 ns (原为 15 ns)
* Minimum RAS to CAS delay (tRCD): 17.5 ns (原为 15 ns)
* Minimum Active to Precharge Time (tRAS): 55 ns (原为 45 ns)

使用“编辑” -> “固定校验和”来修复校验和。将其  另存为新的 SPD 文件。  
（译者注：此处“固定校验和”为 SPDTool 软件的一个翻译错误，应译作“修复校验和”）

## 写回 SPD

RW Everything 不允许直接写入 SPD，但允许写入任意 SMBus 设备，包括 SPD EEPROM。记下 SPD EEPROM 的地址，在我的情况下为 0xA0。

打开 DIMM SPD 编辑器，加载修改后的 SPD 文件，并将其另存为 .rw 文件。使用文本编辑器打开 .rw 文件，将第一行从 “ Type：DIMM SPD Address 00” 更改为 “ Type：SMBUS Address A0”（这里用你机器上的实际地址），然后删除文件末尾的所有注释。

在 RW Everything 里，点击 Access-> SMBus Device，加载先前修改后的 .rw 文件，它将自动将 SPD 写回到内存 SPD 芯片中。如果看到“ SMBus Access Error”，则表明这条内存的 SPD EEPROM 有写保护功能，可以换一条内存或者试试对写保护解锁。

## 完成

终于完成了。试试看机器能不能正常启动！请注意，如果清除了 CMOS 设置，第一次开机时的自动重启是正常的。

<!-- ![avatar](https://www.zephray.me/api/media/1597549434398-IMG_1766.jpg) -->

在BIOS中，新处理器应该也会显示出来：

<!-- ![avatar](https://www.zephray.me/api/media/1597549723485-6F3DADD8C0904781F493DEE629D92386.jpg) -->

不要管 BIOS 中的显示错误，在操作系统里，CPU-Z 应该可以正确显示 CPU 确实以 2.4GHz 的速度运行：

<!-- ![avatar](http://valid.x86.fr/cache/screenshot/2cblk1.png) -->

CPU-Z validation: http://valid.x86.fr/2cblk1

## 结语：

这番折腾，现在我有了配备 Core 2 Duo P8600 的 X61s。很高兴这真的行得通。但我也许不会建议大家也去这样做的。T9900 或 Q9100 应该可以说在 2020 是过时了的。改装需要投入大量的时间和金钱，其回报远不及所需的投入（P8600 比原装 L7500 性能提升了 70％，但垃圾的 1.7 倍仍然是垃圾）。这只是我的梦想之一。长期以来，我一直在考虑升级 X61s 的CPU，但之前我根本没有足够的信心来完成这样的工作。感谢每个在线共享知识和经验的人，没有他们的付出，这项工作也不可能完成。希望您喜欢这篇介绍，谢谢阅读。