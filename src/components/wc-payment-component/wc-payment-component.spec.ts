import { newSpecPage } from '@stencil/core/testing';
import { WcPaymentComponent } from './wc-payment-component';

describe('WcPaymentComponent', () => {

  it('renders', async () => {
    const page = await newSpecPage({
      components: [WcPaymentComponent],
      html: `<wc-payment-component wc-data='{"journey":"payment","uuid":"3fe53410-a293-11eb-a199-8104a45b4d0a","deviceId":"1111dad2232323836","channel":"channel","channelType":"channelType","platform":"web","purchaseOrderId":"836","idToken":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJ6NFJpaG54N0FvZmdVd1Y0UFlqUiJ9.eyJnTmFtZSI6IkhwIiwiZk5hbWUiOiJIcCIsImVtYWlsViI6InRydWUiLCJwaG9uZVYiOiJmYWxzZSIsImFsbEFjYyI6InRydWUiLCJzZWNMb2dpbiI6InRydWUiLCJhTCI6Ilt7XCJjdHJ5XCI6XCJib1wiLFwiY2FJZFwiOlwiMTU1OTExOTJcIixcInNzSWRcIjpcInF2YW50ZWxcIixcInBydFR5cGVcIjpcImluZGl2aWR1YWxcIixcImJhTFwiOlt7XCJiYUlkXCI6XCIxNTg5MjgxNlwiLFwicHNJZFwiOlwiNTkxNjkxOTEyMTJcIixcImJ1XCI6XCJtb2JpbGVcIixcImJ0XCI6XCJwcmVwYWlkXCIsXCJwclwiOlwiZ3Vlc3RcIixcInNMXCI6W3tcInNJZFwiOlwiNjkxOTEyMTJcIixcInN0XCI6XCJwcmVwYWlkXCIsXCJhSWRcIjpcIjY5MTkxMjEyXCIsXCJwSWRcIjpcIjE4OFwiLFwibXNpc2RuTFwiOlt7XCJtc2lzZG5cIjpcIjU5MTY5MTkxMjEyXCJ9XX1dfV0sXCJwT0lkXCI6e1wiZHRcIjpcImNpXCIsXCJkblwiOlwiTWpBd01EQXdNREE0Tmc9PVwifX1dIiwiaGFzUHdkIjoidHJ1ZSIsImh5YkxvZ2luIjoiZmFsc2UiLCJ1blR5cGUiOiJlbWFpbCIsInVjYyI6Im9uZWFwcCIsInVjY3QiOiJlbWFpbCIsImN1c3RvbTpVVUlEIjoiM2ZlNTM0MTAtYTI5My0xMWViLWExOTktODEwNGE0NWI0ZDBhIiwiY3RyeSI6ImJvIiwiY3QiOiJ1c2VybmFtZS1wYXNzd29yZC1hdXRoZW50aWNhdGlvbiIsImdpdmVuX25hbWUiOiJIYXJzaCIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJuaWNrbmFtZSI6ImhhcGF0ZWwrMSIsIm5hbWUiOiJIYXJzaCBQYXRlbCIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci81Njg1NjFmMjEwNTk5MDg4MjIxZDk1MjI2ZTU4ZmI0Mj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmhwLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA4LTI5VDA4OjU2OjIyLjExM1oiLCJlbWFpbCI6ImhhcGF0ZWwrMUBtb2JpcXVpdHlpbmMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vaWQtdGlnby1iby1zdGcudGlnb2Nsb3VkLm5ldC8iLCJhdWQiOiIyUFIzdXZUQ01BVkZyVjQwWFFVR2RDbFlZbEtUMkRjTiIsImlhdCI6MTY5NDA4NTQ1NywiZXhwIjoxNjk0MDg5MDU3LCJzdWIiOiJhdXRoMHwzZmU1MzQxMC1hMjkzLTExZWItYTE5OS04MTA0YTQ1YjRkMGEifQ.oMgqjN5aS_NPaVGm9wdkHkRf7USPDJMjur9SA4NSQKshO3ecOIi2Opl2VPDvw7B6dnRYig0gq_2C1yGjfVOg1ntO4WDNxJFL4a2qqIV2yEgYj3Xsa5xIebUJ_AdwZdw7GM4PLvjQoo19csIAxRpTZhoNmjN3ZOjAMVHpTveJVSTVsVsKYTunx52eG3vEJk2v0W05MOtW-WSQXjzNOxxoD-xiktvq4h5VCrPI73wI6yTUNhpYVPG-mtHn_30GP0olPRIg8nDVM7dtEZbM7z6x9PgFQcrpQ1sS2NgJXJ7304Ry29_ls_lykO6M2MieDQIGlA_Vb6BpNHfMjAYFzgiTNQ"}'></wc-payment-component>`,
    });
    expect(page.root).toEqualHtml(`
      <wc-payment-component wc-data='{"journey":"payment","uuid":"3fe53410-a293-11eb-a199-8104a45b4d0a","deviceId":"1111dad2232323836","channel":"channel","channelType":"channelType","platform":"web","purchaseOrderId":"836","idToken":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJ6NFJpaG54N0FvZmdVd1Y0UFlqUiJ9.eyJnTmFtZSI6IkhwIiwiZk5hbWUiOiJIcCIsImVtYWlsViI6InRydWUiLCJwaG9uZVYiOiJmYWxzZSIsImFsbEFjYyI6InRydWUiLCJzZWNMb2dpbiI6InRydWUiLCJhTCI6Ilt7XCJjdHJ5XCI6XCJib1wiLFwiY2FJZFwiOlwiMTU1OTExOTJcIixcInNzSWRcIjpcInF2YW50ZWxcIixcInBydFR5cGVcIjpcImluZGl2aWR1YWxcIixcImJhTFwiOlt7XCJiYUlkXCI6XCIxNTg5MjgxNlwiLFwicHNJZFwiOlwiNTkxNjkxOTEyMTJcIixcImJ1XCI6XCJtb2JpbGVcIixcImJ0XCI6XCJwcmVwYWlkXCIsXCJwclwiOlwiZ3Vlc3RcIixcInNMXCI6W3tcInNJZFwiOlwiNjkxOTEyMTJcIixcInN0XCI6XCJwcmVwYWlkXCIsXCJhSWRcIjpcIjY5MTkxMjEyXCIsXCJwSWRcIjpcIjE4OFwiLFwibXNpc2RuTFwiOlt7XCJtc2lzZG5cIjpcIjU5MTY5MTkxMjEyXCJ9XX1dfV0sXCJwT0lkXCI6e1wiZHRcIjpcImNpXCIsXCJkblwiOlwiTWpBd01EQXdNREE0Tmc9PVwifX1dIiwiaGFzUHdkIjoidHJ1ZSIsImh5YkxvZ2luIjoiZmFsc2UiLCJ1blR5cGUiOiJlbWFpbCIsInVjYyI6Im9uZWFwcCIsInVjY3QiOiJlbWFpbCIsImN1c3RvbTpVVUlEIjoiM2ZlNTM0MTAtYTI5My0xMWViLWExOTktODEwNGE0NWI0ZDBhIiwiY3RyeSI6ImJvIiwiY3QiOiJ1c2VybmFtZS1wYXNzd29yZC1hdXRoZW50aWNhdGlvbiIsImdpdmVuX25hbWUiOiJIYXJzaCIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJuaWNrbmFtZSI6ImhhcGF0ZWwrMSIsIm5hbWUiOiJIYXJzaCBQYXRlbCIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci81Njg1NjFmMjEwNTk5MDg4MjIxZDk1MjI2ZTU4ZmI0Mj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmhwLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA4LTI5VDA4OjU2OjIyLjExM1oiLCJlbWFpbCI6ImhhcGF0ZWwrMUBtb2JpcXVpdHlpbmMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vaWQtdGlnby1iby1zdGcudGlnb2Nsb3VkLm5ldC8iLCJhdWQiOiIyUFIzdXZUQ01BVkZyVjQwWFFVR2RDbFlZbEtUMkRjTiIsImlhdCI6MTY5NDA4NTQ1NywiZXhwIjoxNjk0MDg5MDU3LCJzdWIiOiJhdXRoMHwzZmU1MzQxMC1hMjkzLTExZWItYTE5OS04MTA0YTQ1YjRkMGEifQ.oMgqjN5aS_NPaVGm9wdkHkRf7USPDJMjur9SA4NSQKshO3ecOIi2Opl2VPDvw7B6dnRYig0gq_2C1yGjfVOg1ntO4WDNxJFL4a2qqIV2yEgYj3Xsa5xIebUJ_AdwZdw7GM4PLvjQoo19csIAxRpTZhoNmjN3ZOjAMVHpTveJVSTVsVsKYTunx52eG3vEJk2v0W05MOtW-WSQXjzNOxxoD-xiktvq4h5VCrPI73wI6yTUNhpYVPG-mtHn_30GP0olPRIg8nDVM7dtEZbM7z6x9PgFQcrpQ1sS2NgJXJ7304Ry29_ls_lykO6M2MieDQIGlA_Vb6BpNHfMjAYFzgiTNQ"}'>
      <mock:shadow-root>
         <div class="ml-card"></div>
         <div class="at-payment-list-card ml-card">
           <div class="at-card-header">
             Escoge tu forma de pago
           </div>
         </div>
         <div class="ml-popup" id="mypopup" style="display: none;">
           <div class="popup-content">
             <div class="at-content-popup-header">
               <div class="at-content-popup-title">
                 <h5>
                   ¡Ahorra tiempo en tus próximos pagos!
                 </h5>
                 <img alt="Auto Packs" class="at-auto-packs-icon" src="/assets/imgs/auto-packs.png">
               </div>
             </div>
             <div class="at-content-popup-body">
               <p class="at-font-p">
                 ¡Activa el pago automático de tu factura y despreocúpate!
               </p>
             </div>
             <div class="at-content-popup-footer">
               <button class="at-button-primary">
                 ACTIVAR PAGO AUTOMÁTICO
               </button>
               <button class="at-button-secondary">
                 NO, GRACIAS
               </button>
             </div>
           </div>
         </div>
       </mock:shadow-root>
      </wc-payment-component>
    `);
  });
});