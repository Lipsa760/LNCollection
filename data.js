
// <table class="buy-now-table"><tr><td>
//   <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
//    <input type="hidden" name="cmd" value="_s-xclick">
//    <input type="hidden" name="hosted_button_id" value="A65ZSPPX3LKZJ">
//    <table>
//   <tr><td><input type="hidden" name="on0" value="quantity">quantity</td></tr><tr><td><select name="os0">
//    <option class="quantity-option" value="<%=element.value1%>ml"><%=element.value1%>ml &#8377;<%=element.price1%>.00 INR</option>
//    <option class="quantity-option" value="<%=element.value2%>ml"><%=element.value2%>ml &#8377;<%=element.price2%>.00 INR</option>
//  </select> </td></tr>
//    </table>
//    <input type="hidden" name="currency_code" value="INR">
//    <input type="image" class="add-to-cart-button" src="button_add-to-cart.png"  border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">
//    <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
//    </form>




// </td>


// <td class="buy-now-td">


//    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
//      <input type="hidden" name="cmd" value="_s-xclick">
//      <input type="hidden" name="hosted_button_id" value="27S8YBDVNKMHE">
//      <table>
//      <tr><td><input type="hidden" name="on0" value="quantity">quantity</td></tr><tr><td><select name="os0">
//        <option class="quantity-option" value="<%=element.value1%>ml"><%=element.value1%>ml &#8377;<%=element.price1%>.00 INR</option>
//      <option class="quantity-option" value="<%=element.value2%>ml"><%=element.value2%>ml &#8377;<%=element.prie1%>.00 INR</option>
//    </select> </td></tr>
//      </table>
//      <input type="hidden" name="currency_code" value="INR">
//      <input type="image" class="add-to-cart-button" src="buy-now.png" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">
//      <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
//      </form>



//  </td>
//  </tr></table>
    const productList=
    [
        {
            id:0,
            productfor:"women",
            brand:"fogg",
            img:"perfumes/fogg-queen-ladies.jpg",
            name:"impressio",
            quantity:"100ml",
            price:200,
             dollaramount: 2.73,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:1,
            productfor:"men",
            brand:"fogg",
            img:"perfumes/fogg-impressio-men.jpg",
            name:"fogg",
            quantity:"100ml",
            price:210,
            dollaramount:  2.86, 
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:2,
            productfor:"men",
            brand:"fogg",
            img:"perfumes/fogg-intensio-men.jpg",
            name:"fogg",
            quantity:"100ml",
            price:299,
            dollaramount:  4.08, 
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:3,
            productfor:"women",
            brand:"denver",
            img:"perfumes/denver-blackcode-ladies.jpeg",
            name:"denver",
            quantity:"100ml",
            price:300,
           dollaramount:4.09,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:4,
            productfor:"men",
            brand:"fogg",
            img:"perfumes/fogg-xtremo-men.jpg",
            name:"fogg",
            quantity:"100ml",
            price:210, 
            dollaramount: 2.86, 
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:5,
            productfor:"women",
            brand:"denver",
            img:"perfumes/denver-insight-ladies.jpeg",
            name:"denver",
            quantity:"100ml",
            price:240,
            dollaramount: 3.27, 
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:6,
            productfor:"women",
            brand:"fogg",
            img:"perfumes/fogg-secret-ladies.jpg",
            name:"fogg",
            quantity:"100ml",
            price:200,
            dollaramount: 2.73,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:7,
            productfor:"women",
            brand:"fogg",
            img:"perfumes/fogg-midnight-ladies.jpg",
            name:"fogg",
            quantity:"100ml",
            price:240,
             dollaramount:  3.27,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
        {
            id:8,
            productfor:"men",
            brand:"denver",
            img:"perfumes/denver-noir-men.png",
            name:"denver",
            quantity:"100ml",
            price:200,
             dollaramount: 2.73,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        },
       
        {
            id:9,
            productfor:"men",
            brand:"denver",
            img:"perfumes/denver-mystic-men.png",
            name:"denver",
            quantity:"100ml",
            price:240,
             dollaramount: 3.27,
            description:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. "
        }
    ];
    
    module.exports.productList=productList;