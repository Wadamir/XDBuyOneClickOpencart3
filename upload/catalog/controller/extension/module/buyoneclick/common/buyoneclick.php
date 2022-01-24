<?php
class ControllerExtensionModuleBuyoneclickCommonBuyoneclick extends Controller {
	public function info() {
		$this->load->model('setting/setting');
		$buyoneclick = $this->config->get('buyoneclick');
		$data['buyoneclick_field1_status'] 		= $buyoneclick['field1_status'];
		$data['buyoneclick_field1_required'] 	= ($data['buyoneclick_field1_status'] == 2) ?  true : false;
		$data['buyoneclick_field2_status'] 		= $buyoneclick['field2_status'];
		$data['buyoneclick_field2_required'] 	= ($data['buyoneclick_field2_status'] == 2) ?  true : false;
		$data['buyoneclick_field3_status'] 		= $buyoneclick['field3_status'];
		$data['buyoneclick_field3_required'] 	= ($data['buyoneclick_field3_status'] == 2) ?  true : false;
		$data['buyoneclick_field4_status'] 		= $buyoneclick['field4_status'];
		$data['buyoneclick_field4_required'] 	= ($data['buyoneclick_field4_status'] == 2) ?  true : false;
		$data['buyoneclick_validation_type'] 	= $buyoneclick['validation_type'];
		$data['buyoneclick_quantity'] 			= $buyoneclick['quantity'];
		$data['buyoneclick_stock_status'] 		= $buyoneclick['stock_status'];
		$data['buyoneclick_option_status']				= $buyoneclick['option_status'];
		$data['buyoneclick_ya_status'] 					= $buyoneclick['ya_status'];
		$data['buyoneclick_ya_counter'] 				= $buyoneclick['ya_counter'];
		$data['buyoneclick_ya_identificator'] 			= $buyoneclick['ya_identificator'];
		$data['buyoneclick_ya_identificator_send'] 		= $buyoneclick['ya_identificator_send'];
		$data['buyoneclick_ya_identificator_success'] 	= $buyoneclick['ya_identificator_success'];
		$data['buyoneclick_google_status'] 				= $buyoneclick['google_status'];
		$data['buyoneclick_google_category_btn'] 		= $buyoneclick['google_category_btn'];
		$data['buyoneclick_google_action_btn'] 			= $buyoneclick['google_action_btn'];
		$data['buyoneclick_google_category_send'] 		= $buyoneclick['google_category_send'];
		$data['buyoneclick_google_action_send'] 		= $buyoneclick['google_action_send'];
		$data['buyoneclick_google_category_success'] 	= $buyoneclick['google_category_success'];
		$data['buyoneclick_google_action_success'] 		= $buyoneclick['google_action_success'];
		$data['buyoneclick_exan_status'] 				= $buyoneclick['exan_status'];
		$this->load->language('extension/module/buyoneclick');
		$data['buyoneclick_title'] 						= $this->language->get('buyoneclick_title');
		$data['buyoneclick_button'] 					= $this->language->get('buyoneclick_button');
		$data['buyoneclick_text_loading'] 				= $this->language->get('buyoneclick_text_loading');
		$data['buyoneclick_field1_title'] 				= $this->language->get('buyoneclick_field1_title');
		$data['buyoneclick_field2_title'] 				= $this->language->get('buyoneclick_field2_title');
		$data['buyoneclick_field3_title'] 				= $this->language->get('buyoneclick_field3_title');
		$data['buyoneclick_field4_title'] 				= $this->language->get('buyoneclick_field4_title');
		$data['buyoneclick_button_order'] 				= $this->language->get('buyoneclick_button_order');
		$data['text_option'] 							= $this->language->get('text_option');
		$data['text_select'] 							= $this->language->get('text_select');
		$data['button_upload'] 							= $this->language->get('button_upload');
		$data['text_loading'] 							= $this->language->get('text_loading');
		$data['text_out_stock'] 						= $this->language->get('text_out_stock');
		$data['text_max_stock'] 						= $this->language->get('text_max_stock');
		$data['text_min_stock'] 						= $this->language->get('text_min_stock');
		$data['text_error_form'] 						= $this->language->get('text_error_form');
		$data['buyoneclick_agree_status'] 				= $buyoneclick['agree_status'];
		// Additional text
		$current_language_id = $this->config->get('config_language_id');
		$data['buyoneclick_note_field'] = isset($buyoneclick["note_field"][$current_language_id]) ? htmlspecialchars_decode($buyoneclick["note_field"][$current_language_id]) : '';
		if ($buyoneclick['agree_status']) {
			$this->load->model('catalog/information');
			$information_info = $this->model_catalog_information->getInformation($buyoneclick['agree_status']);
			if ($information_info) {
				$data['buyoneclick_text_agree'] = sprintf($this->language->get('buyoneclick_text_agree'), $this->url->link('information/information', 'information_id=' . $buyoneclick['agree_status'], 'SSL'), $information_info['title'], $information_info['title']);
			} else {
				$data['buyoneclick_text_agree'] = '';
			}
		} else {
			$data['buyoneclick_text_agree'] = '';
		}
		$data['text_empty'] = $this->language->get('text_empty');
		$data['text_checkout'] = $this->language->get('text_checkout');
		unset($this->session->data['boc_product_id']);
		unset($this->session->data['boc_product_quantity']);
		unset($this->session->data['boc_product_option']);
		$data['logged'] = $this->customer->isLogged();
		if ($data['logged']) {
			$this->load->model('account/customer');
			$data['customer_info'] = $this->model_account_customer->getCustomer($this->customer->getId());
		}
		$json = array();
		if (isset($this->request->post['product_id'])) {
			$product_id = (int)$this->request->post['product_id'];
			$this->session->data['boc_product_id'] = $product_id;
		} else {
			$product_id = 0;
		}
		$this->load->model('catalog/product');
		$this->load->model('tool/image');
		$this->load->model('tool/upload');
		$product_info = $this->model_catalog_product->getProduct($product_id);
		if ($product_info) {
			$data['out_stock'] = false;
			$data['stock_quantity'] = $product_info['quantity'];
			$data['max_quantity'] = $product_info['quantity'];
			if ($product_info['quantity'] <= 0 && $data['buyoneclick_stock_status'] == '2') {
				$data['stock'] = $this->language->get('text_stock') . ' ' . $product_info['stock_status'];
			} else {
				$data['stock'] = '';
			}
			if (isset($this->request->post['quantity']) && ((int)$this->request->post['quantity'] >= (int)$product_info['minimum'])) {
				if((int)$this->request->post['quantity'] > (int)$data['stock_quantity'] && $data['buyoneclick_stock_status'] == '2') {
					$product_info['quantity'] = ((int)$data['stock_quantity'] > 0) ? (int)$data['stock_quantity'] : (int)$product_info['minimum'];
				} else {
					$product_info['quantity'] = (int)$this->request->post['quantity'];
				}
			} else {
				if((int)$product_info['minimum'] > (int)$data['stock_quantity'] && (int)$data['stock_quantity'] > 0) {
					$product_info['quantity'] = (int)$data['stock_quantity'];
				} else {
					$product_info['quantity'] = (int)$product_info['minimum'];
				}
			}
			$this->session->data['boc_product_quantity'] = $product_info['quantity'];
			if ($product_info['image']) {
				$image = $this->model_tool_image->resize($product_info['image'], $this->config->get('theme_' . $this->config->get('config_theme') . '_image_thumb_width'), $this->config->get('theme_' . $this->config->get('config_theme') . '_image_thumb_height'));
			} else {
				$image = '';
			}
			// options
			if (isset($this->request->post['option'])) {
				$checked_options = array_filter($this->request->post['option']);
			} else {
				$checked_options = array();
			}
			$product_options = $this->model_catalog_product->getProductOptions($product_id);
			if ($data['buyoneclick_option_status'] == '1') {
				foreach ($product_options as $product_option) {
					if ($product_option['required'] && empty($checked_options[$product_option['product_option_id']])) {
						$this->load->language('checkout/cart');
						$json['error']['option'][$product_option['product_option_id']] = sprintf($this->language->get('error_required'), $product_option['name']);
					}
				}
			}
			if (!$json) {
				// Currency
				$this->load->model('localisation/currency');
				$data['config_currency_code'] = $this->config->get('config_currency');
				$data['config_currency_id'] = $this->currency->getId($data['config_currency_code']);
				$data['currency_code'] = $this->session->data['currency'];
				$data['currencies'] = array();
				$results = $this->model_localisation_currency->getCurrencies();
				foreach ($results as $result) {
					if ($result['status'] && $data['currency_code'] == $result['code']) {
						$currency_id = $this->currency->getId($data['currency_code']);
						$currency_decimal_point = $this->currency->getDecimalPlace($data['currency_code']);
						$data['current_currency'] = array(
							'id'			=> $currency_id,
							'title'        	=> $result['title'],
							'code'         	=> $result['code'],
							'symbol_left'  	=> $result['symbol_left'],
							'symbol_right' 	=> $result['symbol_right'],
							'decimal_point' => $currency_decimal_point,
						);
					}
				}
				$option_data = array();
				foreach ($product_options as $product_option_key=>$product_option_value) {
					if (!empty($checked_options) && in_array(intval($product_option_value['product_option_id']),array_keys($checked_options))) {
						foreach ($checked_options as $checked_options_key=>$checked_options_value) {
							$product_option_value_data = array();
							if($product_option_value['product_option_id'] == $checked_options_key) {
								foreach ($product_option_value['product_option_value'] as $option_value_key=>$option_value) {
									if (!$option_value['subtract'] || ($option_value['quantity'] > 0)) {
										if ((($this->config->get('config_customer_price') && $this->customer->isLogged()) || !$this->config->get('config_customer_price')) && (float)$option_value['price']) {
											$price = $this->currency->format($this->tax->calculate($option_value['price'], $product_info['tax_class_id'], $this->config->get('config_tax') ? 'P' : false), $this->session->data['currency']);
										} else {
											$price = false;
										}
										if(is_array($checked_options_value)){
											if(in_array($option_value['product_option_value_id'],$checked_options_value)) {
												if ($product_info['quantity'] < $option_value['quantity']) {
													$product_info['quantity'] = (int)$product_info['quantity'];
												} else if ((int)$option_value['quantity'] > 0 && (int)$option_value['quantity'] > (int)$product_info['minimum']) {
													$product_info['quantity'] = (int)$option_value['quantity'];
												} else {
													$product_info['quantity'] = (int)$product_info['minimum'];
													if($option_value['subtract']) {
														$data['out_stock'] = true;
													}
												}
												$data['max_quantity'] = ($data['stock_quantity'] < $option_value['quantity'] || !$option_value['subtract']) ? $data['stock_quantity'] : $option_value['quantity'];
												$product_option_value_data[$option_value_key] = array(
													'product_option_value_id'	=> $option_value['product_option_value_id'],
													'option_value_id'       	=> $option_value['option_value_id'],
													'name'                  	=> $option_value['name'],
													'image'                 	=> $this->model_tool_image->resize($option_value['image'], 50, 50),
													'base_price'               	=> $option_value['price'],
													'cur_price'               	=> $this->currency->convert((float)$option_value['price'],$data['config_currency_code'],$data['current_currency']['code']),
													'price'                 	=> $price,
													'price_prefix'         		=> $option_value['price_prefix'],
													'quantity'         			=> $option_value['quantity'],
													'subtract'         			=> $option_value['subtract'],
													'checked'			  		=> true
												);
											} else {
												$product_option_value_data[$option_value_key] = array(
													'product_option_value_id' 	=> $option_value['product_option_value_id'],
													'option_value_id'         	=> $option_value['option_value_id'],
													'name'                    	=> $option_value['name'],
													'image'                   	=> $this->model_tool_image->resize($option_value['image'], 50, 50),
													'base_price'               	=> $option_value['price'],
													'cur_price'               	=> $this->currency->convert((float)$option_value['price'],$data['config_currency_code'],$data['current_currency']['code']),
													'price'                   	=> $price,
													'price_prefix'            	=> $option_value['price_prefix'],
													'quantity'         			=> $option_value['quantity'],
													'subtract'         			=> $option_value['subtract'],
													'checked'			  		=> false
												);
											}
										} else {
											if($option_value['product_option_value_id'] == $checked_options_value) {
												if ($product_info['quantity'] < $option_value['quantity']) {
													$product_info['quantity'] = (int)$product_info['quantity'];
												} else if ((int)$option_value['quantity'] > 0 && (int)$option_value['quantity'] > (int)$product_info['minimum']) {
													$product_info['quantity'] = (int)$option_value['quantity'];
												} else {
													$product_info['quantity'] = (int)$product_info['minimum'];
													if($option_value['subtract']) {
														$data['out_stock'] = true;
													}
												}
												$data['max_quantity'] = ($data['stock_quantity'] < $option_value['quantity'] || !$option_value['subtract']) ? $data['stock_quantity'] : $option_value['quantity'];
												$product_option_value_data[$option_value_key] = array(
													'product_option_value_id'	=> $option_value['product_option_value_id'],
													'option_value_id'       	=> $option_value['option_value_id'],
													'name'                  	=> $option_value['name'],
													'image'                 	=> $this->model_tool_image->resize($option_value['image'], 50, 50),
													'base_price'               	=> $option_value['price'],
													'cur_price'               	=> $this->currency->convert((float)$option_value['price'],$data['config_currency_code'],$data['current_currency']['code']),
													'price'                 	=> $price,
													'price_prefix'         		=> $option_value['price_prefix'],
													'quantity'         			=> $option_value['quantity'],
													'subtract'         			=> $option_value['subtract'],
													'checked'			  		=> true
												);
											} else {
												$product_option_value_data[$option_value_key] = array(
													'product_option_value_id' 	=> $option_value['product_option_value_id'],
													'option_value_id'         	=> $option_value['option_value_id'],
													'name'                    	=> $option_value['name'],
													'image'                   	=> $this->model_tool_image->resize($option_value['image'], 50, 50),
													'base_price'               	=> $option_value['price'],
													'cur_price'               	=> $this->currency->convert((float)$option_value['price'],$data['config_currency_code'],$data['current_currency']['code']),
													'price'                   	=> $price,
													'price_prefix'            	=> $option_value['price_prefix'],
													'quantity'         			=> $option_value['quantity'],
													'subtract'         			=> $option_value['subtract'],
													'checked'			  		=> false
												);
											}
										}
									}
								}
								$data['options'][$product_option_key] = array(
									'product_option_id'    => $product_option_value['product_option_id'],
									'product_option_value' => $product_option_value_data,
									'option_id'            => $product_option_value['option_id'],
									'name'                 => $product_option_value['name'],
									'type'                 => $product_option_value['type'],
									'value'                => $product_option_value['value'],
									'required'             => $product_option_value['required'],
									'checked'			   => true
								);
								$option_data[] = array(
									'product_option_id'    => $product_option_value['product_option_id'],
									'product_option_value' => $product_option_value_data,
									'option_id'            => $product_option_value['option_id'],
									'name'                 => $product_option_value['name'],
									'type'                 => $product_option_value['type'],
									'value'                => $product_option_value['value'],
									'required'             => $product_option_value['required'],
									'checked'			   => true
								);
							}
						}
					} else {
						$product_option_value_data = array();
						foreach ($product_option_value['product_option_value'] as $option_value) {
							if (!$option_value['subtract'] || ($option_value['quantity'] > 0)) {
								if ((($this->config->get('config_customer_price') && $this->customer->isLogged()) || !$this->config->get('config_customer_price')) && (float)$option_value['price']) {
									$price = $this->currency->format($this->tax->calculate($option_value['price'], $product_info['tax_class_id'], $this->config->get('config_tax') ? 'P' : false), $this->session->data['currency']);
								} else {
									$price = false;
								}
								$product_option_value_data[] = array(
									'product_option_value_id' 	=> $option_value['product_option_value_id'],
									'option_value_id'         	=> $option_value['option_value_id'],
									'name'                    	=> $option_value['name'],
									'image'                   	=> $this->model_tool_image->resize($option_value['image'], 50, 50),
									'base_price'               	=> $option_value['price'],
									'cur_price'               	=> $this->currency->convert((float)$option_value['price'],$data['config_currency_code'],$data['current_currency']['code']),
									'price'                   	=> $price,
									'price_prefix'            	=> $option_value['price_prefix'],
									'quantity'         			=> $option_value['quantity'],
									'subtract'         			=> $option_value['subtract'],
									'checked'			  		=> false
								);
							}
						}
						$data['options'][$product_option_key] = array(
							'product_option_id'    		=> $product_option_value['product_option_id'],
							'product_option_value' 		=> $product_option_value_data,
							'option_id'           		=> $product_option_value['option_id'],
							'name'                		=> $product_option_value['name'],
							'type'                		=> $product_option_value['type'],
							'value'               		=> $product_option_value['value'],
							'required'            		=> $product_option_value['required'],
							'checked'			  		=> false
						);
					}
				}
				if (!empty($option_data)) {
					$this->session->data['boc_product_option'] = $option_data;
				}
				// Display prices
				if (($this->config->get('config_customer_price') && $this->customer->isLogged()) || !$this->config->get('config_customer_price')) {
					$price = $this->currency->format($this->tax->calculate($product_info['price'], $product_info['tax_class_id'], $this->config->get('config_tax')), $this->session->data['currency']);
					$boc_price = $product_info['price'];
					if ((float)$product_info['special']) {
						$special = $this->currency->format($this->tax->calculate($product_info['special'], $product_info['tax_class_id'], $this->config->get('config_tax')), $this->session->data['currency']);
						$boc_price = $product_info['special'];
					} else {
						$special = false;
					}
				} else {
					$price = false;
					$special = false;
				}
				$discounts = $this->model_catalog_product->getProductDiscounts($product_id);
				if ($discounts) {
					foreach ($discounts as $discount) {
						if ($discount['quantity'] <= $product_info['quantity']) {
							$boc_price = $discount['price'];
						}
					}
				}
				// Display total
				if (($this->config->get('config_customer_price') && $this->customer->isLogged()) || !$this->config->get('config_customer_price')) {
					if (!$option_data) {
						$total = $this->currency->format($this->tax->calculate($boc_price, $product_info['tax_class_id'], $this->config->get('config_tax')) * $product_info['quantity'], $this->session->data['currency']);
					} else {
						$option_total = 0;
						foreach ($option_data as $option) {
							foreach ($option['product_option_value'] as $product_option_value) {
								if($product_option_value['checked']) {
									if ($product_option_value['price_prefix'] == '+') {
										$option_total += $product_option_value['base_price'];
									} else if ($product_option_value['price_prefix'] == '-') {
										$option_total -= $product_option_value['base_price'];
									} else if ($product_option_value['price_prefix'] == '=') {
										$boc_price = $product_option_value['base_price'];
									} else if ($product_option_value['price_prefix'] == '*') {
										$boc_price = $boc_price * $product_option_value['base_price'];
									} else if ($product_option_value['price_prefix'] == '/') {
										$boc_price = $boc_price / $product_option_value['base_price'];
									} else if ($product_option_value['price_prefix'] == 'u') {
										$boc_price = $boc_price + (( $boc_price * $product_option_value['base_price'] ) / 100);
									} else if ($product_option_value['price_prefix'] == 'd') {
										$boc_price = $boc_price - (( $boc_price * $product_option_value['base_price'] ) / 100);
									}
								}
							}
						}
						$total = $this->currency->format($this->tax->calculate((float)$boc_price + (float)$option_total, $product_info['tax_class_id'], $this->config->get('config_tax')) * $product_info['quantity'], $this->session->data['currency']);
					}
				} else {
					$total = false;
				}
				// Prices
				$cur_price = $this->currency->convert((float)$product_info['price'],$data['config_currency_code'],$data['current_currency']['code']);
				$cur_price_special = $this->currency->convert((float)$product_info['special'],$data['config_currency_code'],$data['current_currency']['code']);
				$data['product'] = array (
					'product_id'     		=> $product_info['product_id'],
					'thumb'     			=> $image,
					'name'      			=> $product_info['name'],
					'model'     			=> $product_info['model'],
					'minimum'   			=> $product_info['minimum'],
					'option'    			=> $option_data,
					'quantity'  			=> $product_info['quantity'],
					'price'     			=> $price,
					'special'   			=> $special,
					'base_price'			=> $product_info['price'],
					'cur_price'     		=> $cur_price,
					'base_price_special'	=> $product_info['special'],
					'cur_price_special'   	=> $cur_price_special,
					'tax_class_id'			=> $product_info['tax_class_id'],
					'total'     			=> $total,
					'href'      			=> $this->url->link('product/product', 'product_id=' . $product_info['product_id'])
				);
				$json['success'] = $this->load->view('common/buyoneclick', $data);
			} else {
				$json['redirect'] = str_replace('&amp;', '&', $this->url->link('product/product', 'product_id=' . $product_id));
			}
		}
		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}
	public function recalculate() {
		$json = array();
		if (isset($this->request->post['base_total'])) {
			$base_total = (int)$this->request->post['base_total'];
		} else {
			$base_total = 0;
		}
		if (isset($this->request->post['quantity'])) {
			$quantity = (int)$this->request->post['quantity'];
		} else {
			$quantity = 0;
		}
		if (isset($this->request->post['tax_class_id'])) {
			$tax_class_id = (int)$this->request->post['tax_class_id'];
		} else {
			$tax_class_id = 0;
		}
		$json['total'] = $this->currency->format($this->tax->calculate((float)$base_total, $tax_class_id, $this->config->get('config_tax')) * $quantity, $this->session->data['currency']);
		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}
	public function validateOptions() {
		$json = array();
		$this->load->language('extension/module/buyoneclick');
		$data['error_required'] = $this->language->get('error_required');
		if (isset($this->request->post['boc_product_id'])) {
			$product_id = (int)$this->request->post['boc_product_id'];
			$this->session->data['boc_product_id'] = $product_id;
		} else {
			$product_id = 0;
		}
		if (isset($this->request->post['option'])) {
			$checked_options = array_filter($this->request->post['option']);
		} else {
			$checked_options = array();
		}
		$this->load->model('catalog/product');
		$product_options = $this->model_catalog_product->getProductOptions($product_id);
		foreach ($product_options as $product_option) {
			if ($product_option['required'] && empty($checked_options[$product_option['product_option_id']])) {
				$json['error']['option'][$product_option['product_option_id']] = sprintf($this->language->get('error_required'), $product_option['name']);
			}
		}
		if(empty($json)) $json['success'] = 'Options validation success!';
		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}	
}