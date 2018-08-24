<template>
    <div class="row">
        <!-- First Column (with items)-->
        <div class="col-md-6">
            <!-- Item -->
            <div class="row" v-for="(prod, index) in productMap" :key="index">
                <!--Item Container-->
                <div class="card border-0 flex-md-row mb-5 h-md-250">
                    <!-- Image -->
                    <img class="card-img-right flex-auto d-none d-lg-block"
                          alt="Thumbnail [250x250]"
                         :src="prod.menuAsset.url"
                         data-holder-rendered="true"> <!-- End Image -->
                    <!-- Item Content -->
                    <div class="card-body d-flex flex-column align-items-start">

                        <h3 class="mb-0">
                            {{prod.name}}
                        </h3>
                        <div class="mb-1 text-muted ingredientes">
                            <i v-for="(topi, index) in prod.toppings" :key="index">
                                <span>{{topi.name}}</span><span v-if="index+1 < prod.toppings.length" >, </span>
                            </i>

                        </div>
                        <div class="mb-1">
                            <button class="btn btn-lg btn-circle btn-success" @click="addToCart(index)"><font-awesome-icon icon="plus"/></button>
                            ${{prod.price}}
                        </div>
                    </div><!-- Item Content -->
                </div><!-- Edn Item Container -->
            </div><!-- End Item -->
        </div><!--End First Column-->

        <!-- Second Column (with billing)-->
        <div class="col-md-6">
            <h1>Your Order</h1>
            <!--Order detail-->
            <table class="table">
                <thead>
                </thead>
                <tbody>
                <tr v-for="(order, index) in cart" :key="index">
                    <th scope="row">
                        <img class="flex-auto"
                             alt="Thumbnail [60x60]" style="width: 60px; height: 60px;"
                             :src="order.img" data-holder-rendered="true">
                    </th>
                    <td class="text-center">
                        <!--Add and Remove Widget-->
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12">
                                    {{order.name}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <font-awesome-icon icon="plus" @click="addOne(order.id)"/>
                                    <span>  x{{order.qty }}  </span>
                                    <font-awesome-icon icon="minus" @click="removeOne(order.id)"/>
                                    <font-awesome-icon icon="trash" @click="deleteItem(order.id)"/>
                                </div>
                            </div>
                        </div><!--End Add and Remove Widget-->


                    </td>
                    <td class="text-right">&#36;</td>
                    <td class="subtotal">{{order.price * order.qty}}</td>
                </tr>
                <tr>
                    <th scope="row">Subtotal</th>
                    <td></td>
                    <td class="text-right">&#36;</td>
                    <td>{{subTotalQuantity}}</td>
                </tr>
                <tr>
                    <th scope="row">Coupon</th>
                    <td></td>
                    <td class="text-right">-&#36;</td>
                    <td class="subtotal">{{coupons}}</td>
                </tr>
                <tr>
                    <th scope="row">Delivery Free</th>
                    <td></td>
                    <td class="text-right">&#36;</td>
                    <td class="subtotal">{{delivery}}</td>
                </tr>
                <tr>
                    <th scope="row">Tax</th>
                    <td></td>
                    <td class="text-right">&#36;</td>
                    <td class="subtotal">{{taxes}}</td>
                </tr>
                <tr>
                    <th scope="row">TOTAL</th>
                    <td></td>
                    <td class="text-right">&#36;</td>
                    <td>{{grandTotal}}</td>
                </tr>
                </tbody>
            </table>
            <button class="btn-checkout btn btn-success" @click="checkout()" > Checkout </button>
        </div><!-- End Second Column -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PizzaCart',
  props: {
    msg: String,
  },
  data() {
    return {
      cart: [],
      selectedPizza: {
      },
      subtotal: 0,
      total: 0,
      title: 'Pizza Menu',
      menu: undefined,
      productMap: {},
      taxes: 0.27,
      coupons: 16,
      delivery: 2.99,
    };
  },
  beforeMount() {
    return axios.get('https://api.myjson.com/bins/d7wgd')
      .then((response) => {
        this.productMap = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    subTotalQuantity() {
      const sum = [];
      for (let i = 0; i < this.cart.length; i++) {
        sum.push(parseInt(this.cart[i].qty) * parseInt(this.cart[i].price));
      }
      const sub = sum.reduce((a, b) => a + b, 0);
      this.subtotal = sub;
      return this.subtotal;
    },
    grandTotal() {
      const total = (this.subtotal + this.delivery + this.taxes - this.coupons);
      this.total = total.toFixed(2);
      return this.total;
    },
  },
  methods: {
  	checkout() {
      alert('Chechout');
    },
    removeOne(id) {
      const order = this.cart.find(p => p.id === id);
      const sum = parseInt(order.qty) - 1;

      if (sum < 1) this.deleteItem(id);
      this.update(id, 'qty', sum);
    },
    addOne(id) {
      const order = this.cart.find(p => p.id === id);
      const sum = parseInt(order.qty) + 1;
      this.update(id, 'qty', sum);
    },
    deleteItem(id) {
      const idx = this.cart.findIndex(obj => obj.id == id);
      this.cart.splice(idx, 1);
    },
    update(id, prop, val) {
      const order = this.cart.find(p => p.id === id);
      if (order && order[prop]) {
        order[prop] = val;
      }
    },
    addToCart(key) {
      const [id, price, name, qty, img, cart, pizza] = [this.productMap[key].id, this.productMap[key].price, this.productMap[key].name, 1, this.productMap[key].menuAsset.url, this.cart, this.selectedPizza];
      const isRepeated = this.searchById(id, cart);

      if (isRepeated) {
      	this.addOne(isRepeated.id, isRepeated.qty);
      } else {
        this.cart.push(Object.assign({}, pizza, {
          id, name, price, qty, img,
        }));
      }
    },
    searchById(nameKey, myArray) {
      for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].id === nameKey) {
          return myArray[i];
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .btn-checkout {
        background-color: #6ea559 !important;
        font-size: 1.7em;
        border-color: #6ea559 !important;
        width: 100%;
    }

    /*Item specifiv*/
    h3 {
        color: red;
    }
    /* Overrite add btn color */
    .btn-circle {
        border-radius: 50% !important;
        background-color: #6ea559 !important;
        font-size: 1.7em;
        border-color: #6ea559 !important;
    }
    /* Styling ingredients */
    .ingredientes{
        font-style: italic;
        font-family: Helvetica sans-serif;
        color: dimgray;
        font-size: 16px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .card img{
        width: 250px;
        height: 250px;
    }
</style>
