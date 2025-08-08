
<map>
  <node ID="root" TEXT="项目">
    <node TEXT="id（项目编号）" ID="d96f43863867b9bd90306c8286607246" STYLE="bubble" POSITION="right"/>
    <node TEXT="项目名称" ID="de0d3453ad491cbf8028dcedb35801ee" STYLE="bubble" POSITION="right"/>
    <node TEXT="关联客户" ID="bd2695ca9a2d5ee2a657bae5a6276374" STYLE="bubble" POSITION="right"/>
    <node TEXT="关联联系人" ID="147b26f93e683f91c04febcc180643bd" STYLE="bubble" POSITION="right"/>
    <node TEXT="进度状态" ID="32c161a28e6cad944987f29a94f65f75" STYLE="bubble" POSITION="right">
      <node TEXT="咨询中" ID="9a8033939be7f498e7251d8696d44d7e" STYLE="fork"/>
      <node TEXT="进行中" ID="0a76db1c0acbe8072ea9618ed730d6c9" STYLE="fork"/>
      <node TEXT="搁置" ID="25e6d7090b2e3ca95996fe6135546b4f" STYLE="fork"/>
      <node TEXT="已取消" ID="8f3c588b030a4cd45d985b5bc1354aad" STYLE="fork"/>
      <node TEXT="部分交付" ID="d78008cd1bd2e59bdda9f657c41cbf4e" STYLE="fork"/>
      <node TEXT="完全交付" ID="6e72662a43b1bafed27b0df9e64e5a40" STYLE="fork"/>
    </node>
    <node TEXT="结算状态" ID="6a92b6d4c427cf9a374ade6266bb1d0d" STYLE="bubble" POSITION="right">
      <node TEXT="全部未结" ID="2ccfc4290106237ea51bd0911dd27b9e" STYLE="fork"/>
      <node TEXT="已预付" ID="737cccebf905858a32881c9fbcf25949" STYLE="fork"/>
      <node TEXT="部分结清" ID="0c93d6e9a1dea52879bedbc58d20e6ee" STYLE="fork"/>
      <node TEXT="全部结清" ID="706e607c322e07a8748a97d5ac0f5ad3" STYLE="fork"/>
    </node>
    <node TEXT="关联任务" ID="8a563ba801eddc5bd5f144cbe981c079" STYLE="bubble" POSITION="right">
      <node TEXT="任务数据表" ID="0f15c1a7c5420619c23f38a1eeff173a" STYLE="fork">
        <node TEXT="id" ID="72768a5f38afa9d5181c3fc2f0126ccc" STYLE="fork"/>
        <node TEXT="关联项目" ID="7b9fb4d1ddff6b4b0cf2d4ad3a80bcd3" STYLE="fork"/>
        <node TEXT="关联服务" ID="43045dff84f1c4ca631cf554147a245b" STYLE="fork"/>
        <node TEXT="进度" ID="844127371b26cbaf118d3b42c5539998" STYLE="fork"/>
        <node TEXT="规格" ID="a222c66688a2d6931dcb6c6734bf7f6c" STYLE="fork"/>
        <node TEXT="紧急度" ID="f9b5cb294b45190e4b818b419a48e816" STYLE="fork"/>
        <node TEXT="主创设计师" ID="5d37196bef63ef72911b613a0e3517c9" STYLE="fork"/>
        <node TEXT="助理设计师" ID="59766c912af03f48e1236ff62c1d7057" STYLE="fork"/>
        <node TEXT="数量" ID="c597864cfc719ca4ae2b4fa4b8c1f97d" STYLE="fork"/>
        <node TEXT="金额" ID="7c3a9cf952f30b39136c4d1f6bee3b27" STYLE="fork"/>
        <node TEXT="计费说明" ID="6be484642234acfc1599fca60c4706cd" STYLE="fork"/>
        <node TEXT="关联方案" ID="e4a9f012cc5c16e5d9bcc4e4c13055ad" STYLE="fork"/>
        <node TEXT="创建时间" ID="daa3493383041f89183c6e6df951e288" STYLE="fork"/>
        <node TEXT="需求时间" ID="fc0e216c33f97b987379a33e3709d56f" STYLE="fork"/>
        <node TEXT="交付时间" ID="9439161ec46befee430ad2d9fdf65f5d" STYLE="fork"/>
        <node TEXT="结算状态" ID="4dacbf52954ceb251a2c885d85650538" STYLE="fork">
          <node TEXT="未结算" ID="e0b62ed399d965681ba194f414151366" STYLE="fork"/>
          <node TEXT="已搁置" ID="8fe91bba99d13deac2a56fabd0424a86" STYLE="fork"/>
          <node TEXT="已预付" ID="577ddbd5657e341df1b1602ad72605f1" STYLE="fork"/>
          <node TEXT="已损稿结算" ID="7e2fceb4b7fb721861918decb675fe4c" STYLE="fork"/>
          <node TEXT="已完整结算" ID="6dd9172b4d4730a1bcded50df3d38e8a" STYLE="fork"/>
          <node TEXT="已取消" ID="fd3bb80a4c98cf200d38d934c7bf890c" STYLE="fork"/>
        </node>
        <node TEXT="结算时间" ID="1f5e6e214e52d40881d2a8ff99f91f78" STYLE="fork"/>
      </node>
    </node>
    <node TEXT="关联文件" ID="997980a5bd0e80d2523b94665fbbd3cd" STYLE="bubble" POSITION="right">
      <node TEXT="文件数据表" ID="a73ceb65cfadcc2c1eeff398a351842b" STYLE="fork"/>
    </node>
    <node TEXT="关联合同" ID="ac4fd9b1c981944db8af5968c9422e77" STYLE="bubble" POSITION="right">
      <node TEXT="合同数据表" ID="0d371c751643762b97d9ed78640141e7" STYLE="fork"/>
    </node>
    <node TEXT="关联发票" ID="fa79cb6607e3f96b39425b6cb31b953a" STYLE="bubble" POSITION="right">
      <node TEXT="发票数据表" ID="585f8d100c82fea4aba81c4c9e48f4f9" STYLE="fork">
        <node TEXT="id" ID="23be42eff29908a78d816ab06f81ebfe" STYLE="fork"/>
        <node TEXT="发票号码" ID="d47ca0dca2bbd1444eed90550ab99849" STYLE="fork"/>
        <node TEXT="发票金额" ID="777bce7df4e75fef51a8d11ac438fe69" STYLE="fork"/>
        <node TEXT="税率" ID="a0971bd02a94f67283959d009e104847" STYLE="fork"/>
        <node TEXT="发票类型" ID="130afaf6861685e36301ec8e83b2333e" STYLE="fork">
          <node TEXT="增值税专用发票" ID="8299e1c9c22f348a1259e84bcd883779" STYLE="fork"/>
          <node TEXT="增值税普通发票" ID="439609208bcbf31911a566799d38d2c7" STYLE="fork"/>
        </node>
        <node TEXT="开票日期" ID="878156079c1360967fc387807aa222fe" STYLE="fork"/>
        <node TEXT="费用类型" ID="471441991eedfe55bc4d3ec68501cf36" STYLE="fork">
          <node TEXT="预付金" ID="febf9f7de9be58e85d6354e01367f454" STYLE="fork"/>
          <node TEXT="尾款" ID="357b7c2a701ceefb0e2cad0ed6cf735c" STYLE="fork"/>
          <node TEXT="全款" ID="6c8a69aeaa63acaa6234977fe79f51f8" STYLE="fork"/>
          <node TEXT="损稿费" ID="21cdc714c85136a4b379bc1dfb585a33" STYLE="fork"/>
        </node>
        <node TEXT="关联客户" ID="ae23e039cc5e336ed6da9ae6c07b35c7" STYLE="fork"/>
        <node TEXT="关联联系人" ID="73cfb43beb2a2675558b115849d89891" STYLE="fork"/>
        <node TEXT="关联项目" ID="e7b6b9a846c97fd3e0122e6b4c6372b1" STYLE="fork"/>
        <node TEXT="发票文件" ID="a417824c93bd34ef3ddb0178563e15f9" STYLE="fork"/>
      </node>
    </node>
    <node TEXT="主创设计师" ID="b26a65586db51e2bafd99ca5ddc069e8" STYLE="bubble" POSITION="right"/>
    <node TEXT="助理设计师" ID="73f6da4f3f745ead8b5c700482222b78" STYLE="bubble" POSITION="right"/>
    <node TEXT="客户嘱托" ID="f7a4b2bc438a58572644e7504dcf3a26" STYLE="bubble" POSITION="right">
      <node TEXT="嘱托数据表" ID="edcffb0b7b5673fcc50aced5729701fe" STYLE="fork"/>
    </node>
    <node TEXT="关联方案(提案)" ID="2bd10e776cb1aa980d76e6fa008f7a4c" STYLE="bubble" POSITION="right">
      <node TEXT="方案数据表" ID="6305eb67bef4cfc3e55ef98cfed272e1" STYLE="fork">
        <node TEXT="id" ID="dc337f3d53dd995f807d808a0358b34f" STYLE="fork"/>
        <node TEXT="关联项目" ID="0871b70f54a2bd248c9f0137933531fd" STYLE="fork"/>
        <node TEXT="关联任务" ID="0bc083e447f1b4f8740a4e89b396ee1a" STYLE="fork"/>
        <node TEXT="版本表" ID="f51983b73287d96341c7bd79606eb2e8" STYLE="fork">
          <node TEXT="" ID="52e89882dc146d12734b5468bfaa20d3" STYLE="fork"/>
        </node>
        <node TEXT="关联文件" ID="44578e6980c9e8e8b0c810eff0a07371" STYLE="fork"/>
        <node TEXT="关联信息" ID="6459de182af1abdd8100838100dad80a" STYLE="fork"/>
      </node>
    </node>
    <node TEXT="创建时间" ID="f6897d09052513bb241645a86691de58" STYLE="bubble" POSITION="right"/>
    <node TEXT="开始时间（调整为进行中的时间）" ID="b2ff832d45248a619de33efc53e79714" STYLE="bubble" POSITION="right"/>
    <node TEXT="交付时间（调整为完全交付的时间）" ID="031e8b0cc5024245161c34cca7e55ec1" STYLE="bubble" POSITION="right"/>
    <node TEXT="结算时间（调整为完全交付的时间）" ID="eb9413ad60309d1189f211c7b55fad46" STYLE="bubble" POSITION="right"/>
    <node TEXT="项目日志" ID="3724d684b7d675dae78cda50f64ff0b5" STYLE="bubble" POSITION="right"/>
  </node>
</map>