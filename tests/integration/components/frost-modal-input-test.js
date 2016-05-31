import {
  assert,
  expect
} from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { initialize } from 'ember-block-slots/initializers/component-block-slots'
import $ from 'jquery'
import {
  beforeEach,
  afterEach,
  done
} from 'mocha'

const testModel = {
  'type': 'object',
  'properties': {
    'username': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'password': {
      'type': 'string'
    },
    'username2': {
      'type': 'string'
    },
    'description2': {
      'type': 'string'
    },
    'password2': {
      'type': 'string'
    },
    'username3': {
      'type': 'string'
    },
    'description3': {
      'type': 'string'
    },
    'password3': {
      'type': 'string'
    }
  },
  'required': [
    'username', 'password'
  ]
}

describeComponent(
  'frost-modal-input',
  'Integration | Component | FrostModalInput',
  {
    integration: true
  },
  function () {
    let container, application

    beforeEach(function () {
      Ember.testing = true
      Ember.run(() => {
        application = Ember.Application.create()
        container = application.__container__
        application.deferReadiness()
        this.setProperties({
          testModel
        })
      })
      initialize(container, application)
    })

    afterEach(function () {
      Ember.testing = false
    })

    it('renders target', function () {
      this.render(hbs`{{#frost-modal-input
          modalName='my-test-modal'
          formModel=testModel
          title='Test title'
          subtitle='Subtitle' as |slot|}}
          {{#block-slot slot 'target'}}
            {{frost-button
              text='Open small form'
              priority='secondary'
              size='medium'}}
          {{/block-slot}}
      {{/frost-modal-input}}`)
      expect(this.$('.frost-button')).to.have.length(1)
    })

    it('opens the modal', function () {
      this.render(hbs`{{#frost-modal-input
          modalName='my-test-modal'
          formModel=testModel
          title='Test title'
          subtitle='Subtitle' as |slot|}}
          {{#block-slot slot 'target'}}
            {{frost-button
              text='Open small form'
              priority='secondary'
              size='medium'}}
          {{/block-slot}}
          {{#block-slot slot 'footer' as |action|}}
            {{action.button
              text='Cancel'
              priority='tertiary'
            }}
            {{action.button
              disabled=(not isValid)
              text='Save'
              priority='primary'
            }}
          {{/block-slot}}
      {{/frost-modal-input}}`)

      this.$('.frost-button')[0].click()
      Ember.run.later(() => {
        let length = $('[data-test-id="modalWindow"].remodal-is-opened').length ||
                    $('[data-test-id="modalWindow"].remodal-is-opening').length
        expect(length).to.equal(1)

        expect($('[data-test-id="yielded"] .input-header').length).is.equal(1)
        expect($('[data-test-id="yielded"] .input-header .primary-title').text()).to.equal('Test title')

        done()
      })
    })

    it('has action buttons', function () {
      this.render(hbs`{{#frost-modal-input
          modalName='my-test-modal'
          formModel=testModel
          title='Test title'
          subtitle='Subtitle' as |slot|}}
          {{#block-slot slot 'target'}}
            {{frost-button
              text='Open small form'
              priority='secondary'
              size='medium'}}
          {{/block-slot}}
          {{#block-slot slot 'footer' as |action|}}
            {{action.button
              text='Cancel'
              priority='tertiary'
            }}
            {{action.button
              disabled=(not isValid)
              text='Save'
              priority='primary'
            }}
          {{/block-slot}}
      {{/frost-modal-input}}`)

      this.$('.frost-button')[0].click()
      Ember.run.later(() => {
        var cancelBtn = $('[data-test-id="modalWindow"] .footer .frost-button')[0]
        var confirmBtn = $('[data-test-id="modalWindow"] .footer .frost-button')[1]
        assert.isNotNull(cancelBtn)
        assert.isNotNull(confirmBtn)

        done()
      })
    })
  }
)
