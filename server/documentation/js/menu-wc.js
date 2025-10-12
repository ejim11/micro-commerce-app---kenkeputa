'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' : 'data-bs-target="#xs-controllers-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' :
                                            'id="xs-controllers-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' : 'data-bs-target="#xs-injectables-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' :
                                        'id="xs-injectables-links-module-AppModule-672a3ce7e3b4666ea7081d0d169c40d1b6b0e8995c6f91706afd93f740a01d53b469e3083d28b116f9caa69b1ff549c63cd7ac0ff8e59742c13d7120f70317d0"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' :
                                            'id="xs-controllers-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' :
                                        'id="xs-injectables-links-module-AuthModule-732892745a7e08e2dbe6b7e6731c8d4e4ddff91ca46ff83bb3a6c9095d73efd72a27459547a279c781727e3794a92cbb8c6d06d66f4b511ee02d7588d6244732"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GenerateTokensProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenerateTokensProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SignInProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignInProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartModule.html" data-type="entity-link" >CartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' : 'data-bs-target="#xs-controllers-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' :
                                            'id="xs-controllers-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' }>
                                            <li class="link">
                                                <a href="controllers/CartController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' : 'data-bs-target="#xs-injectables-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' :
                                        'id="xs-injectables-links-module-CartModule-95d1bb28b5f139e9584c2540b0f55e6de73247ab8d8cdb88ab85c8ca9f55978575a9589cd9364e5a3d0dc8c3d2fa042aae55ef3e72a0c4d17bd5026215a098a4"' }>
                                        <li class="link">
                                            <a href="injectables/AddToCartProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddToCartProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CartService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GetCartProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetCartProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UpdateCartItemProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateCartItemProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrdersModule.html" data-type="entity-link" >OrdersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' : 'data-bs-target="#xs-controllers-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' :
                                            'id="xs-controllers-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' }>
                                            <li class="link">
                                                <a href="controllers/OrdersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' : 'data-bs-target="#xs-injectables-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' :
                                        'id="xs-injectables-links-module-OrdersModule-7406c69d728e545004144ecadc009d5955422b5c28e99da3f4d4f66f624b5563627e38ac6a0507a12669c7439a785bff4c872ebdfcea6aa788949a483e49e4bf"' }>
                                        <li class="link">
                                            <a href="injectables/CreateOrderProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateOrderProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindAllOrdersForUserProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindAllOrdersForUserProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindOrderByIdProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindOrderByIdProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrdersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaginationModule.html" data-type="entity-link" >PaginationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaginationModule-c999ec83fa446b9ea19d24ee0a6e56c581d86a5632cf36ae10c29d023d3c04796a0ed53a4d793419d8e1b10f6bd03438e096eafb9c8ddd56a9755c3470044f4b"' : 'data-bs-target="#xs-injectables-links-module-PaginationModule-c999ec83fa446b9ea19d24ee0a6e56c581d86a5632cf36ae10c29d023d3c04796a0ed53a4d793419d8e1b10f6bd03438e096eafb9c8ddd56a9755c3470044f4b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaginationModule-c999ec83fa446b9ea19d24ee0a6e56c581d86a5632cf36ae10c29d023d3c04796a0ed53a4d793419d8e1b10f6bd03438e096eafb9c8ddd56a9755c3470044f4b"' :
                                        'id="xs-injectables-links-module-PaginationModule-c999ec83fa446b9ea19d24ee0a6e56c581d86a5632cf36ae10c29d023d3c04796a0ed53a4d793419d8e1b10f6bd03438e096eafb9c8ddd56a9755c3470044f4b"' }>
                                        <li class="link">
                                            <a href="injectables/PaginationProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaginationProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' : 'data-bs-target="#xs-controllers-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' :
                                            'id="xs-controllers-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' }>
                                            <li class="link">
                                                <a href="controllers/ProductsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' : 'data-bs-target="#xs-injectables-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' :
                                        'id="xs-injectables-links-module-ProductsModule-189030416679130d82e5ce380adab651ab2c98bec84a5a34f128586002a07cedf16ebfca06fb72805b20e7669a03007874602ff4623eb55e9b4923fd50319bd1"' }>
                                        <li class="link">
                                            <a href="injectables/CreateProductProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateProductProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeleteProductProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteProductProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindAllProductsProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindAllProductsProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindProductByIdProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindProductByIdProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UpdateProductProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateProductProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' :
                                            'id="xs-controllers-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' :
                                        'id="xs-injectables-links-module-UsersModule-90de3f55f80fd3cb9e1004be730c52f0fb355ecca482297f9abda1bfca0b789763f28a5834558e42ef2517bcd26728a8b54c760d6d02ed690838568f1424f42f"' }>
                                        <li class="link">
                                            <a href="injectables/CreateUserProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUserProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindUserByEmailProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindUserByEmailProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindUserByIdProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindUserByIdProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/CartItem.html" data-type="entity-link" >CartItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Order.html" data-type="entity-link" >Order</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderItem.html" data-type="entity-link" >OrderItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateCartItemDto.html" data-type="entity-link" >CreateCartItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDto.html" data-type="entity-link" >CreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseConnectionException.html" data-type="entity-link" >DatabaseConnectionException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductsBaseDto.html" data-type="entity-link" >GetProductsBaseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductsDto.html" data-type="entity-link" >GetProductsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlobalExceptionFilter.html" data-type="entity-link" >GlobalExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationQueryDto.html" data-type="entity-link" >PaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeedProducts1759619432047.html" data-type="entity-link" >SeedProducts1759619432047</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartItemDto.html" data-type="entity-link" >UpdateCartItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationException.html" data-type="entity-link" >ValidationException</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BcryptProvider.html" data-type="entity-link" >BcryptProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataResponseInterceptor.html" data-type="entity-link" >DataResponseInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorHandlingInterceptor.html" data-type="entity-link" >ErrorHandlingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HashingProvider.html" data-type="entity-link" >HashingProvider</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link" >AuthenticationGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActiveUserData.html" data-type="entity-link" >ActiveUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cart.html" data-type="entity-link" >Cart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorResponse.html" data-type="entity-link" >ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Paginated.html" data-type="entity-link" >Paginated</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});