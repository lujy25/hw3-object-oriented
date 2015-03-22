function Base(value) {
	this.instanceVariable = value;
}

Base.staticVariable = 'Base';

Base.prototype.instanceMethod = function() {
	console.log("This is from Base class instance-method, instance-variable is: " + this.instanceVariable);
}

Base.staticMethod = function() {
	console.log("This is from Base class static-method, static-variable is: " + this.staticVariable);
}

function Derived(value) {
	this.instanceVariable = value;
}

Derived.staticVariable = 'Derived';

function extend(base, derived) {
	derived.prototype.instanceMethod = function() {
		base.prototype.instanceMethod.call(this);
		console.log("This is from Derived class instance-method, instance-variable is: " + this.instanceVariable);
	}

	derived.staticMethod = function() {
		base.staticMethod.call(this);
		console.log("This is from Derived class static-method, static-variable is: " + this.staticVariable);
	}
}

extend(Base, Derived);

console.log("-----------------------first part-----------------------");

var example = new Derived('example');
Derived.staticMethod();
example.instanceMethod();

console.log("-----------------------second part-----------------------");

example = new Derived('example');
otherExample = new Derived('other-example');
Derived.staticMethod();
example.instanceMethod();
otherExample.instanceMethod();
