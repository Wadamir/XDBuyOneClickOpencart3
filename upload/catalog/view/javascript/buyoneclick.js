$(document).ready(function() {
	sbjs.init({
		callback: placeData
	});
	$('body').on('focus','#boc_form #boc_form_fields input', function(){
		$(this).parent().removeClass('has-error');
		$(this).parent().parent().removeClass('has-error');
	});
	$('body').on('focus','#boc_form #boc_form_fields textarea', function(){
		$(this).parent().removeClass('has-error');
	});
	$('body').on('focus','#boc_form input', function(){
		$(this).parent().parent().removeClass('has-error');
		$(this).parent().parent().find('.text-danger').remove();
	});
	$('body').on('focus','#boc_form .radio', function(){
		$(this).parent().parent().removeClass('has-error');
		$(this).parent().parent().find('.text-danger').remove();
	});
	$('body').on('focus','#boc_form .checkbox input', function(){
		$(this).parent().parent().removeClass('has-error');
		$(this).parent().parent().find('.text-danger').remove();
	});
	$('body').on('focus','#boc_form select', function(){
		$(this).parent().removeClass('has-error');
		$(this).parent().find('.text-danger').remove();
	});
    $('body').on('submit','#boc_form', function(event) {
		event.preventDefault ? event.preventDefault() : (event.returnValue = false);

		var buyoneclick_option_status = parseInt($('#buyoneclick_option_status').val().trim(),10),
			sendingForm = $(this),
			submit_btn = $(this).find('button[type=submit]'),
			value_text = $(submit_btn).text(),
			waiting_text = $(submit_btn).data('loading-text'),
			validation_result = true;
			option_validation_result = true;

		$(submit_btn).prop( 'disabled', true );
		$(submit_btn).addClass('waiting').text(waiting_text);

		if(!formValidation(event.target)){
			validation_result = false;
		}

		if(buyoneclick_option_status) {
			option_validation_result = false;
			$.ajax({
				url: 'index.php?route=extension/module/buyoneclick/common/buyoneclick/validateOptions',
				type: 'post',
				data: $('#boc_form input[type=\'text\'], #boc_form input[type=\'tel\'], #boc_form input[type=\'email\'], #boc_form input[type=\'hidden\'], #boc_form input[type=\'radio\']:checked, #boc_form input[type=\'checkbox\']:checked, #boc_form select, #boc_form textarea'),
				dataType: 'json',
				complete: function() {
					// $(sendingForm).trigger('reset');
					$(submit_btn).removeClass('waiting');
					$(submit_btn).text(value_text);
					$(submit_btn).prop( 'disabled', false );
					if(option_validation_result && validation_result) {
						$.ajax({
							url: 'index.php?route=extension/module/buyoneclick/checkout/buyoneclick/submit',
							type: 'post',
							data: $('#boc_form input[type=\'tel\'], input[type=\'email\'], input[type=\'text\'], #boc_form input[type=\'hidden\'], #boc_form input[type=\'radio\']:checked, #boc_form input[type=\'checkbox\']:checked, #boc_form select, #boc_form textarea'),
							dataType: 'json',
							complete: function() {
								$(submit_btn).button('reset');
							},
							success: function(json) {
								console.log('Ajax success!');
								clickAnalyticsSuccess();
								if (json['redirect']) {
									location = json['redirect'];
								} else if (json['success']) {
									var success = true;
									$(sendingForm).trigger('reset');
									$(submit_btn).removeClass('waiting');
									$(submit_btn).text(value_text);
									$(submit_btn).prop( 'disabled', false );
									$('#boc_order').modal('hide');
									$('#boc_order').on('hidden.bs.modal', function (e) {
										if (success) {
											$('#boc_success').modal('show');
											setTimeout(function(){
												$('#boc_success').modal('hide');
											}, 4000);
											success = false;
										}
									});
								}
							},
							error: function(xhr, ajaxOptions, thrownError) {
								console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
								$(submit_btn).prop( 'disabled', false );
								$(submit_btn).removeClass('waiting').text("ERROR");
								setTimeout(function(){
									$(submit_btn).delay( 3000 ).text(value_text);
								}, 3000);
							}
						});
					} else {
						return false;
					}
				},
				success: function(json) {
					if (json['error']) {
						if (json['error']['option']) {
							for (i in json['error']['option']) {
								var element = $('#boc_product_options #input-option' + i.replace('_', '-'));
								if (element.parent().hasClass('input-group')) {
									element.parent().parent().addClass('has-error');
									element.parent().parent().find('.text-danger').remove();
									element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
								} else {
									element.parent().addClass('has-error');
									element.parent().find('.text-danger').remove();
									element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
								}
							}
						}
					} else if (json['success']) {
						option_validation_result = true;
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			});
		} else if (validation_result) {
			$.ajax({
				url: 'index.php?route=extension/module/buyoneclick/checkout/buyoneclick/submit',
				type: 'post',
				data: $('#boc_form input[type=\'text\'], #boc_form input[type=\'tel\'], #boc_form input[type=\'email\'], #boc_form input[type=\'hidden\'], #boc_form input[type=\'radio\']:checked, #boc_form input[type=\'checkbox\']:checked, #boc_form select, #boc_form textarea'),
				dataType: 'json',
				beforeSend: function() {
					$(submit_btn).prop( 'disabled', true );
					$(submit_btn).addClass('waiting').text(waiting_text);
				},
				complete: function() {
					$(submit_btn).button('reset');
				},
				success: function(json) {
					console.log('Ajax success!');
					clickAnalyticsSuccess();
					if (json['redirect']) {
						location = json['redirect'];
					} else if (json['success']) {
						var success = true;
						$(sendingForm).trigger('reset');
						$(submit_btn).removeClass('waiting');
						$(submit_btn).text(value_text);
						$(submit_btn).prop( 'disabled', false );
						$('#boc_order').modal('hide');
						$('#boc_order').on('hidden.bs.modal', function (e) {
							if (success) {
								$('#boc_success').modal('show');
								setTimeout(function(){
									$('#boc_success').modal('hide');
								}, 4000);
								success = false;
							}
						});
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					$(submit_btn).prop( 'disabled', false );
					$(submit_btn).removeClass('waiting').text("ERROR");
					setTimeout(function(){
						$(submit_btn).delay( 3000 ).text(value_text);
					}, 3000);
				}
			});
		} else {
			$(submit_btn).removeClass('waiting');
			$(submit_btn).text(value_text);
			$(submit_btn).prop( 'disabled', false );
			return false;
		}
    });
	$('body').on('click', '.boc_order_btn', function(event) {
		$.ajax({
			url: 'index.php?route=extension/module/buyoneclick/common/buyoneclick/info',
			type: 'post',
			data: $('#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea'),
			dataType: 'json',
			beforeSend: function() {
				$(event.target).button('loading');
				$('#boc_order').empty();
				$('#boc_order').append('<div class="lds-rolling"><div></div></div>');
			},
			complete: function() {
				$(event.target).button('reset');
			},
			success: function(json) {
				$('.alert, .text-danger').remove();
				$('.form-group').removeClass('has-error');
				if (json['error']) {
					if (json['error']['option']) {
						for (i in json['error']['option']) {
							var element = $('#input-option' + i.replace('_', '-'));
							if (element.parent().hasClass('input-group')) {
								element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
							} else {
								element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
							}
						}
					}

					if (json['error']['recurring']) {
						$('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
					}

					// Highlight any found errors
					$('.text-danger').parent().addClass('has-error');
				} else {
					$("#boc_order").modal('show');
					$('#boc_order').empty();
					$('#boc_order').html(json['success']);
					$('#boc_order .date').datetimepicker({
						pickTime: false
					});

					$('#boc_order .datetime').datetimepicker({
						pickDate: true,
						pickTime: true
					});

					$('#boc_order .time').datetimepicker({
						pickDate: false
					});

					$('#boc_order button[id^=\'button-upload\']').on('click', function() {
						var node = this;

						$('#form-upload').remove();

						$('body').prepend('<form enctype="multipart/form-data" id="form-upload" style="display: none;"><input type="file" name="file" /></form>');

						$('#form-upload input[name=\'file\']').trigger('click');

						if (typeof timer != 'undefined') {
							clearInterval(timer);
						}

						timer = setInterval(function() {
							if ($('#form-upload input[name=\'file\']').val() != '') {
								clearInterval(timer);

								$.ajax({
									url: 'index.php?route=tool/upload',
									type: 'post',
									dataType: 'json',
									data: new FormData($('#form-upload')[0]),
									cache: false,
									contentType: false,
									processData: false,
									beforeSend: function() {
										$(node).button('loading');
									},
									complete: function() {
										$(node).button('reset');
									},
									success: function(json) {
										$('.text-danger').remove();

										if (json['error']) {
											$(node).parent().find('input').after('<div class="text-danger">' + json['error'] + '</div>');
										}

										if (json['success']) {
											alert(json['success']);

											$(node).parent().find('input').attr('value', json['code']);
										}
									},
									error: function(xhr, ajaxOptions, thrownError) {
										alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
									}
								});
							}
						}, 500);
					});
					valueData();
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log(thrownError + " | " + xhr.statusText + " | " + xhr.responseText);
			}
		});
	});
	$('body').on('click', '.boc_order_category_btn', function(event) {
		var for_post = {};
		for_post.product_id = $(this).attr('data-product_id');
		$.ajax({
			url: 'index.php?route=extension/module/buyoneclick/common/buyoneclick/info',
			type: 'post',
			data: for_post,
			dataType: 'json',
			beforeSend: function() {
				$(event.target).button('loading');
			},
			complete: function() {
				$(event.target).button('reset');
			},
			success: function(json) {
				$('.alert, .text-danger').remove();
				$('.form-group').removeClass('has-error');
				if (json['redirect']) {
					location = json['redirect'];
				} else {
					$("#boc_order").modal('show');
					$('#boc_order').empty();
					$('#boc_order').html(json['success']);
					$('#boc_order .date').datetimepicker({
						pickTime: false
					});

					$('#boc_order .datetime').datetimepicker({
						pickDate: true,
						pickTime: true
					});

					$('#boc_order .time').datetimepicker({
						pickDate: false
					});

					$('#boc_order button[id^=\'button-upload\']').on('click', function() {
						var node = this;

						$('#form-upload').remove();

						$('body').prepend('<form enctype="multipart/form-data" id="form-upload" style="display: none;"><input type="file" name="file" /></form>');

						$('#form-upload input[name=\'file\']').trigger('click');

						if (typeof timer != 'undefined') {
							clearInterval(timer);
						}

						timer = setInterval(function() {
							if ($('#form-upload input[name=\'file\']').val() != '') {
								clearInterval(timer);

								$.ajax({
									url: 'index.php?route=tool/upload',
									type: 'post',
									dataType: 'json',
									data: new FormData($('#form-upload')[0]),
									cache: false,
									contentType: false,
									processData: false,
									beforeSend: function() {
										$(node).button('loading');
									},
									complete: function() {
										$(node).button('reset');
									},
									success: function(json) {
										$('.text-danger').remove();

										if (json['error']) {
											$(node).parent().find('input').after('<div class="text-danger">' + json['error'] + '</div>');
										}

										if (json['success']) {
											alert(json['success']);

											$(node).parent().find('input').attr('value', json['code']);
										}
									},
									error: function(xhr, ajaxOptions, thrownError) {
										alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
									}
								});
							}
						}, 500);
					});
					valueData();
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log(thrownError + " | " + xhr.statusText + " | " + xhr.responseText);
			}
		});
	});
	$('body').on('click', '.input-number > .btn-quantity', function (event) {
		if($(this).hasClass('disabled')) {
			return false;
		} else {
			$('.input-number > .btn-quantity').removeClass('disabled');
		}
		event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		var buyoneclick_stock_status = parseInt($('#buyoneclick_stock_status').val().trim(),10),
			min_val = parseInt($('#boc_product-minimum').val().trim(),10),
			max_val = parseInt($('#boc_product-max_quantity').val().trim(),10),
			btn = $(this),
			oldValue = parseInt($('#boc_input-quantity').val().trim(),10),
			newValue = 1;

		console.log('buyoneclick_stock_status - ' + buyoneclick_stock_status + ' | min_val - ' + min_val + ' | max_val - ' + max_val + ' | newValue - ' + newValue);

		if (btn.attr('data-dir') == 'up') {
			if (oldValue >= max_val && buyoneclick_stock_status) {
				btn.addClass('disabled');
				if(!$('#text_product_stock').length) {
					$('#text_max_stock').slideDown();
				}
				if(max_val <= 0) {
					newValue = 1;
				} else {
					newValue = max_val;
				}
				setTimeout(function(){
					$('#text_max_stock').slideUp();
				}, 1000);
			} else {
				newValue = parseInt(oldValue) + 1;
			}
		} else {
			if (oldValue > min_val) {
				newValue = parseInt(oldValue) - 1;
			} else {
				btn.addClass('disabled');
				if(!$('#text_product_stock').length) {
					$('#text_min_stock').slideDown();
				}
				newValue = min_val;
				setTimeout(function(){
					$('#text_min_stock').slideUp();
				}, 1000);
			}
		}
		$('#boc_input-quantity').val(newValue);
		recalculateTotal();
	});
	$('body').on('change', '#boc_input-quantity', function (event) {
		var buyoneclick_stock_status = parseInt($('#buyoneclick_stock_status').val().trim(),10),
			min_val = parseInt($('#boc_product-minimum').val().trim(),10),
			max_val = parseInt($('#boc_product-max_quantity').val().trim(),10),
			newValue = parseInt($('#boc_input-quantity').val().trim(),10);

		console.log('buyoneclick_stock_status - ' + buyoneclick_stock_status + ' | min_val - ' + min_val + ' | max_val - ' + max_val + ' | newValue - ' + newValue);

		if (newValue >= max_val && buyoneclick_stock_status) {
			if(!$('#text_product_stock').length) {
				$('#text_max_stock').slideDown();
			}
			if(max_val <= 0) {
				newValue = 1;
			} else {
				newValue = max_val;
			}
			setTimeout(function(){
				$('#text_max_stock').slideUp();
			}, 1000);
		} else if (newValue < min_val) {
			if(!$('#text_product_stock').length) {
				$('#text_min_stock').slideDown();
			}
			newValue = min_val;
			setTimeout(function(){
				$('#text_min_stock').slideUp();
			}, 1000);
		}
		$('#boc_input-quantity').val(newValue);
		recalculateTotal();
	});
	$('body').on('change', '#boc_product_options input, #boc_product_options select', function (event) {
		$('.input-number > .btn-quantity').removeClass('disabled');
		recalculateTotal();
	});
});
function recalculateTotal() {
    var buyoneclick_stock_status = parseInt($('#buyoneclick_stock_status').val().trim(),10),
		base_price = parseFloat($('body #boc_product-base_price').val().trim()),
		base_price_special = parseFloat($('body #boc_product-base_price_special').val().trim()),
		input_quantity = parseInt($('body #boc_input-quantity').val().trim()),
		tax_class_id = parseInt($('body #tax_class_id').val().trim()),
		stock_quantity = parseInt($('body #boc_product-stock_quantity').val().trim()),
		max_quantity = parseInt($('body #boc_product-max_quantity').val().trim()),
		boc_product_minimum = parseInt($('body #boc_product-minimum').val().trim()),
		option_total = 0,
		base_total = 0,
		new_price;

	if(base_price_special != 0 && !isNaN(base_price_special)) {
		main_price = base_price_special;
	} else {
		main_price = base_price;
	}

	min_quantity = stock_quantity;
    $('input:checked,option:selected').each(function() {
		if (!isNaN($(this).data('quantity'))) {
			if (parseInt($(this).data('quantity')) < input_quantity && parseInt($(this).data('subtract')) != 0 && buyoneclick_stock_status) {
				input_quantity = parseInt($(this).data('quantity'));
				if(input_quantity > boc_product_minimum) {
					$('body #boc_input-quantity').val(input_quantity);
				} else {
					$('body #boc_input-quantity').val(boc_product_minimum);
				}
				min_quantity = input_quantity;
			} else {
				if(parseInt($(this).data('quantity')) < min_quantity && parseInt($(this).data('subtract')) != 0) {
					min_quantity = parseInt($(this).data('quantity'));
				}
			}
		}
		$('body #boc_product-max_quantity').val(min_quantity);
		$('body #text_max_stock .text_max_stock_text_value').text(min_quantity);
		if(min_quantity > 0) {
			$('body #text_out_stock').slideUp();
			$('body #boc_submit').removeClass('btn-default').removeClass('disabled').removeAttr('disabled').addClass('btn-primary');
		} else {
			if(!$('#text_product_stock').length) {
				if(buyoneclick_stock_status) {
					$('body #text_out_stock').slideDown();
					$('body #boc_submit').removeClass('btn-primary').addClass('btn-default').addClass('disabled').attr('disabled');
				}
			}
		}
    });

    $('input:checked,option:selected').each(function() {
		if ($(this).data('prefix') == '+') {
			option_total += parseFloat($(this).data('base_price'));
		}
		if ($(this).data('prefix') == '-') {
			option_total -= parseFloat($(this).data('base_price'));
		}
		if ($(this).data('prefix') == 'u') {
			pcnt = 1.0 + parseFloat($(this).data('base_price')) / 100.0;
			option_total *= pcnt;
			main_price *= pcnt;
		}
		if ($(this).data('prefix') == 'd') {
			pcnt = 1.0 - parseFloat($(this).data('base_price')) / 100.0;
			option_total *= pcnt;
			main_price *= pcnt;
		}
		if ($(this).data('prefix') == '*') {
			option_total *= parseFloat($(this).data('base_price'));
			main_price *= parseFloat($(this).data('base_price'));
		}
		if ($(this).data('prefix') == '/') {
			option_total /= parseFloat($(this).data('base_price'));
			main_price /= parseFloat($(this).data('base_price'));
		}
    });

	base_total = main_price + option_total;

	var for_post = {};
	for_post.base_total = base_total;
	for_post.quantity = input_quantity;
	for_post.tax_class_id = tax_class_id;
	$.ajax({
		url: 'index.php?route=extension/module/buyoneclick/common/buyoneclick/recalculate',
		type: 'post',
		data: for_post,
		dataType: 'json',
		beforeSend: function() {
			$('body #product_sum_total').addClass('blured');
		},
		complete: function() {
			$('body #product_sum_total').removeClass('blured');
		},
		success: function(json) {
			$('.form-group').removeClass('has-error');
			if (json['redirect']) {
				location = json['redirect'];
			} else {
				console.log(json);
				$('body #product_sum_total').text(json['total']);
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log(thrownError + " | " + xhr.statusText + " | " + xhr.responseText);
		}
	});
}
function placeData(sb) {
	$sb_first_typ		= sb.first.typ;
	$sb_first_src		= sb.first.src;
	$sb_first_mdm		= sb.first.mdm;
	$sb_first_cmp		= sb.first.cmp;
	$sb_first_cnt		= sb.first.cnt;
	$sb_first_trm		= sb.first.trm;

	$sb_curr_typ		= sb.current.typ;
	$sb_curr_src		= sb.current.src;
	$sb_curr_mdm		= sb.current.mdm;
	$sb_curr_cmp		= sb.current.cmp;
	$sb_curr_cnt		= sb.current.cnt;
	$sb_curr_trm		= sb.current.trm;

	$sb_first_add_fd	= sb.first_add.fd;
	$sb_first_add_ep	= sb.first_add.ep;
	$sb_first_add_rf	= sb.first_add.rf;

	$sb_curr_add_fd		= sb.current_add.fd;
	$sb_curr_add_ep		= sb.current_add.ep;
	$sb_curr_add_rf		= sb.current_add.rf;

	$sb_session_pgs		= sb.session.pgs;
	$sb_session_cpg		= sb.session.cpg;

	$sb_udata_vst		= sb.udata.vst;
	$sb_udata_uip		= sb.udata.uip;
	$sb_udata_uag		= sb.udata.uag;

	$sb_promo_code		= sb.promo.code;
}
function valueData() {
	document.getElementById('sb_first_typ').value       = $sb_first_typ;
	document.getElementById('sb_first_src').value       = $sb_first_src;
	document.getElementById('sb_first_mdm').value       = $sb_first_mdm;
	document.getElementById('sb_first_cmp').value       = $sb_first_cmp;
	document.getElementById('sb_first_cnt').value       = $sb_first_cnt;
	document.getElementById('sb_first_trm').value       = $sb_first_trm;

	document.getElementById('sb_current_typ').value     = $sb_curr_typ;
	document.getElementById('sb_current_src').value     = $sb_curr_src;
	document.getElementById('sb_current_mdm').value     = $sb_curr_mdm;
	document.getElementById('sb_current_cmp').value     = $sb_curr_cmp;
	document.getElementById('sb_current_cnt').value     = $sb_curr_cnt;
	document.getElementById('sb_current_trm').value     = $sb_curr_trm;

	document.getElementById('sb_first_add_fd').value    = $sb_first_add_fd;
	document.getElementById('sb_first_add_ep').value    = $sb_first_add_ep;
	document.getElementById('sb_first_add_rf').value    = $sb_first_add_rf;

	document.getElementById('sb_current_add_fd').value  = $sb_curr_add_fd;
	document.getElementById('sb_current_add_ep').value  = $sb_curr_add_ep;
	document.getElementById('sb_current_add_rf').value  = $sb_curr_add_rf;

	document.getElementById('sb_session_pgs').value     = $sb_session_pgs;
	document.getElementById('sb_session_cpg').value     = $sb_session_cpg;

	document.getElementById('sb_udata_vst').value       = $sb_udata_vst;
	document.getElementById('sb_udata_uip').value       = $sb_udata_uip;
	document.getElementById('sb_udata_uag').value       = $sb_udata_uag;

	document.getElementById('sb_promo_code').value      = $sb_promo_code;
}
function formValidation(formElem){
	var elements = $(formElem).find('#boc_form_fields').find('.required');
	var errorCounter = 0;
	$(elements).each(function(indx,elem){
		var placeholder = $(elem).attr('placeholder');
		if($.trim($(elem).val()) == '' || $(elem).val() == placeholder){
			$(elem).parent().addClass('has-error');
			errorCounter++;
		} else {
			$(elem).parent().removeClass('has-error');
		}
	});
	if ($(formElem).find('#boc_agree').length) {
		if ($(formElem).find('#boc_agree').is(':checked')) {
			$(formElem).find('#boc_agree').parent().parent().removeClass('has-error');
		} else {
			$(formElem).find('#boc_agree').parent().parent().addClass('has-error');
			errorCounter++;
		}
	}
	$(formElem).find('input[name="boc_phone"]').each(function() {
		var pattern = new RegExp(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/);
		var data_pattern = $(this).attr('data-pattern');
		var data_placeholder = $(this).attr('placeholder');
		if(!pattern.test($(this).val()) || $.trim($(this).val()) == '' ){
			console.log('NON valid phone!');
			$('input[name="boc_phone"]').parent().addClass('has-error');
			errorCounter++;
		} else if (data_pattern == 'true') {
			console.log('data-pattern = true');
			if ($(this).val().length < data_placeholder.length) {
				console.log('Phone too short!!!');
				$('input[name="boc_phone"]').parent().addClass('has-error');
				errorCounter++;
			}
		} else {
			$(this).parent().removeClass('has-error');
		}
	});
	if (errorCounter > 0) {
		return false;
	} else {
		return true;
	}
}