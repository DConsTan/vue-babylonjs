let { PhysicsImpostor } = require('babylonjs');
let { capitalize } = require('../util');

const TYPES = [
  'box',
  'cylinder',
  'heightmap',
  'mesh',
  'particle',
  'plane',
  'sphere',
];

module.exports = {
  mixins: [require('../entity/abstract')],

  props: {
    type: {
      validator: value => TYPES.includes(value),
      default: TYPES[0],
    },

    mass: {
      type: Number,
      default: 0,
    },

    friction: {
      type: Number,
      default: 0.2,
    },

    restitution: {
      type: Number,
      default: 0.2,
    },

    options: {
      type: Object,
      default: undefined,
    },

    ignoreParent: {
      type: Boolean,
      default: false,
    },

    bidirectional: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    impostor() {
      return PhysicsImpostor[`${capitalize(this.type)}Impostor`];
    },
  },

  methods: {
    create() {
      let options = {
        mass: this.mass,
        restitution: this.restitution,
        friction: this.friction,
      };
      if (this.options) {
        options.nativeOptions = this.options;
      }
      if (this.ignoreParent) {
        options.ignoreParent = true;
      }
      if (!this.bidirectional) {
        options.disableBidirectionalTransformation = true;
      }
      this.$replace(new PhysicsImpostor(this._$_parent, this.impostor, options, this.$scene));
    },
  },

  watch: {
    type() {
      this.create();
    },

    mass() {
      this.$entity.setMass(this.mass);
    },

    friction() {
      this.$entity.setParam('friction', this.friction);
    },

    restitution() {
      this.$entity.setParam('restitution', this.restitution);
    },

    options: {
      handler() {
        this.$entity.setParam('nativeOptions', this.options);
      },
      deep: true,
    },

    ignoreParent() {
      this.$entity.setParam('ignoreParent', this.ignoreParent);
    },

    disableBidirectionalTransformation() {
      this.$entity.setParam('disableBidirectionalTransformation', !this.bidirectional);
    },
  },

  onScene() {
    this.$sceneBus.$emit('physics');
  },

  onParent() {
    this.create();
  },
};
