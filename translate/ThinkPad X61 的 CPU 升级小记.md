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

除非选择那些更换或升级处理器后的二手。  

给 T61s 更换处理器也是非常平常的事情，只需要购买一个兼容的处理器在主板上安装妥当即可，而如果是想要使用 FSB 1066 或者四核处理器，也不过是需要修改 BIOS 再改装主板而已。 

在 X61 上完成同样的升级可就没这么易行了，其焊接在主板上的处理器使处更换变得非常困难，而 BGA 处理器的购买也要比购买普通的 PGA 处理器困难许多：无论是拆机片还是这样的老型号全新片都很难买到。好在师出同门，如果真的买来这种 CPU 还想办法成功装机了，那些给 T61 用的 BIOS 修改方案和主板改装方案在 X61 上也是可以继续使用的。  

这是一篇讲述如何在供电和散热允许的前提下，将任何 Core 2 Duo 移动处理器安装到 X61 的全面说明。而且这篇教程使用易得的 PGA 封装处理器，而不是那些在 eBay 或其他平台上都很难买到的 BGA 处理器。本文还将介绍如何修改 ACPI 以对抗四核处理器高得多的温度。  

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
* 479 中介层连接器，

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

值得一提的是，即便你只让它进行备份，但它还是需要一个 BIOS 升级文件才行，但这个升级文件不一定必须是有效的升级文件。不知道为什么，在我这里 WinPlash 不能正常工作，会被提示备份已损坏。而且 WinPlash 只支持的 32 位操作系统也越来越少见，所以不妨直接制作一个 USB-DOS 启动盘来完成这项工作，用 Rufus 就可以创建可引导 FreeDOS或MS-DOS U盘。  

完整该步骤后，打开 intelmicrocodelist.exe，将 BIOS 的完整备份拖放到 CMD 窗口中然后按回车，屏幕上会显示所有已经存在的微码补丁。
<!-- ![avatar](https://www.zephray.me/api/media/1597455960257-image_2020-07-24_21-19-56.png) -->

这是我的 X61 已拥有的微码补丁，这里它缺少 1067A 的微码补丁，这意味着 P8x00 或 P9x000 一类较新步进的处理器就用不了了。iMac 的 Core 2 Duo E8xxx 也将无法使用。如果恰好已经支持该处理器（大多数为10676），则不需要修改 BIOS。跳至安装处理器的步骤继续阅读即可。

## 获得微码更新
### 方法1：从英特尔的 Linux 微码补丁中获得

在 2018 年 4 月之前，可以从英特尔官网获取 microcode.dat。但在这之后他们一直改变微码文件的格式。在 2018 年 4 月之前获得历史微码更新的一种方法是使用针对 Linux 发行版打包的版本，例如 Ubuntu：

https://launchpad.net/ubuntu/+source/intel-microcode/3.20180108.0~ubuntu14.04.2

microcode-yyyymmdd.dat 文件就是微码补丁了。可以用 microcode.exe 将其转换为单个二进制微码补丁：
<!-- ![avatar](https://www.zephray.me/api/media/1597466438541-20200815004551.png) -->

解压缩这些文件。现在应该有大量单个的 .bin 二进制文件。

### 方法2：从 BIOS 中提取
从已有的 BIOS dump文件中提取微码补丁也可以。使用相同的 intelmicrocodelist.exe，它可以帮你找到所有微码补丁程序在文件的哪里，使用 dd 命令将他们提取到单个的文件中即可。
<!-- ![avatar](https://www.zephray.me/api/media/1597506111544-20200815114503.png) -->

似乎这里包含的微码补丁比 Linux 补丁还要新，我不确定这是为什么。

## 从 BIOS 提取微码模块
可以使用 phoenixtool 来从 BIOS 中提取微码模块，将 ROM 文件以原始 ROM 方式打开。它应该可以自动提取并保存模块到名为 DUMP 的文件夹中。
<!-- ![avatar](https://www.zephray.me/api/media/1597464279443-20200815000859.png) -->

在 X61 上，UPDATE.ROM 已经包含微码补丁。可以使用 intelmicrocodelist.exe 进行验证：
<!-- ![avatar](https://www.zephray.me/api/media/1597466584965-20200815004811.png) -->

请注意，微码不是从 0 偏移量开始的，但会在文件的末尾结束。这意味着文件的开头还包含其他内容，不过将更多微码附在文件中应该是安全的。

## 组装新的微码模块
此步骤将会向 X61 的 UPDATE.ROM 中添加缺少的微码。

首先，提取微码模块的标头，以便之后可以在标头后追加新的微码。
<!-- ![avatar](https://www.zephray.me/api/media/1597501039631-20200815102240.png) -->

然后就可以将微码补丁用 cat 命令添加到 UPDATE0.ROM 中了。我添加了 6FA、6FD、10676 和 1067A，这应该已经涵盖所有 MP 步进 Merom 和 Penryn 处理器了。但如果处理器是 ES 版或早期步进版，则还需要添加一些其他微码补丁。

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
此步骤的目的是用刚刚新的微码模块替换 BIOS 中的原始微码模块。
