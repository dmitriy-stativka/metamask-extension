import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SendAmountRow from '../send-amount-row.component.js'

import SendRowWrapper from '../../send-row-wrapper/send-row-wrapper.component'
import AmountMaxButton from '../amount-max-button/amount-max-button.container'
import UserPreferencedTokenInput from '../../../../../components/app/user-preferenced-token-input'

describe('SendAmountRow Component', function () {
  describe('validateAmount', () => {
    it('should call updateSendAmountError with the correct params', () => {
      const { instance, propsMethodSpies: { updateSendAmountError } } = shallowRenderSendAmountRow()

      assert.equal(updateSendAmountError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.ok(updateSendAmountError.calledOnceWithExactly({
        amount: 'someAmount',
        amountConversionRate: 'mockAmountConversionRate',
        balance: 'mockBalance',
        conversionRate: 7,
        gasTotal: 'mockGasTotal',
        primaryCurrency: 'mockPrimaryCurrency',
        selectedToken: { address: 'mockTokenAddress' },
        tokenBalance: 'mockTokenBalance',
      }))
    })

    it('should call updateGasFeeError if selectedToken is truthy', () => {
      const { instance, propsMethodSpies: { updateGasFeeError } } = shallowRenderSendAmountRow()

      assert.equal(updateGasFeeError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.ok(updateGasFeeError.calledOnceWithExactly({
        amountConversionRate: 'mockAmountConversionRate',
        balance: 'mockBalance',
        conversionRate: 7,
        gasTotal: 'mockGasTotal',
        primaryCurrency: 'mockPrimaryCurrency',
        selectedToken: { address: 'mockTokenAddress' },
        tokenBalance: 'mockTokenBalance',
      }))
    })

    it('should call not updateGasFeeError if selectedToken is falsey', () => {
      const { wrapper, instance, propsMethodSpies: { updateGasFeeError } } = shallowRenderSendAmountRow()

      wrapper.setProps({ selectedToken: null })

      assert.equal(updateGasFeeError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.equal(updateGasFeeError.callCount, 0)
    })

  })

  describe('updateAmount', () => {

    it('should call setMaxModeTo', () => {
      const { instance, propsMethodSpies: { setMaxModeTo } } = shallowRenderSendAmountRow()

      assert.equal(setMaxModeTo.callCount, 0)

      instance.updateAmount('someAmount')

      assert.ok(setMaxModeTo.calledOnceWithExactly(false))
    })

    it('should call updateSendAmount', () => {
      const { instance, propsMethodSpies: { updateSendAmount } } = shallowRenderSendAmountRow()

      assert.equal(updateSendAmount.callCount, 0)

      instance.updateAmount('someAmount')

      assert.ok(updateSendAmount.calledOnceWithExactly('someAmount'))
    })

  })

  describe('render', () => {
    it('should render a SendRowWrapper component', () => {
      const { wrapper } = shallowRenderSendAmountRow()

      assert.equal(wrapper.find(SendRowWrapper).length, 1)
    })

    it('should pass the correct props to SendRowWrapper', () => {
      const { wrapper } = shallowRenderSendAmountRow()
      const {
        errorType,
        label,
        showError,
      } = wrapper.find(SendRowWrapper).props()

      assert.equal(errorType, 'amount')
      assert.equal(label, 'amount_t:')
      assert.equal(showError, false)
    })

    it('should render an AmountMaxButton as the first child of the SendRowWrapper', () => {
      const { wrapper } = shallowRenderSendAmountRow()

      assert(wrapper.find(SendRowWrapper).childAt(0).is(AmountMaxButton))
    })

    it('should render a UserPreferencedTokenInput as the second child of the SendRowWrapper', () => {
      const { wrapper } = shallowRenderSendAmountRow()

      assert(wrapper.find(SendRowWrapper).childAt(1).is(UserPreferencedTokenInput))
    })

    it('should render the UserPreferencedTokenInput with the correct props', () => {
      const { wrapper, instanceSpies: { updateGas, updateAmount, validateAmount } } = shallowRenderSendAmountRow()
      const {
        onChange,
        error,
        value,
      } = wrapper.find(SendRowWrapper).childAt(1).props()

      assert.equal(error, false)
      assert.equal(value, 'mockAmount')
      assert.equal(updateGas.callCount, 0)
      assert.equal(updateAmount.callCount, 0)
      assert.equal(validateAmount.callCount, 0)

      onChange('mockNewAmount')

      assert.ok(updateGas.calledOnceWithExactly('mockNewAmount'))
      assert.ok(updateAmount.calledOnceWithExactly('mockNewAmount'))
      assert.ok(validateAmount.calledOnceWithExactly('mockNewAmount'))
    })
  })
})

function shallowRenderSendAmountRow () {
  const setMaxModeTo = sinon.spy()
  const updateGasFeeError = sinon.spy()
  const updateSendAmount = sinon.spy()
  const updateSendAmountError = sinon.spy()
  const wrapper = shallow((
    <SendAmountRow
      amount="mockAmount"
      amountConversionRate="mockAmountConversionRate"
      balance="mockBalance"
      conversionRate={7}
      convertedCurrency="mockConvertedCurrency"
      gasTotal="mockGasTotal"
      inError={false}
      primaryCurrency="mockPrimaryCurrency"
      selectedToken={ { address: 'mockTokenAddress' } }
      setMaxModeTo={setMaxModeTo}
      tokenBalance="mockTokenBalance"
      updateGasFeeError={updateGasFeeError}
      updateSendAmount={updateSendAmount}
      updateSendAmountError={updateSendAmountError}
      updateGas={() => {}}
    />
  ), { context: { t: str => str + '_t' } })
  const instance = wrapper.instance()
  const updateAmount = sinon.spy(instance, 'updateAmount')
  const updateGas = sinon.spy(instance, 'updateGas')
  const validateAmount = sinon.spy(instance, 'validateAmount')

  return {
    instance,
    wrapper,
    propsMethodSpies: {
      setMaxModeTo,
      updateGasFeeError,
      updateSendAmount,
      updateSendAmountError,
    },
    instanceSpies: {
      updateAmount,
      updateGas,
      validateAmount,
    },
  }
}
