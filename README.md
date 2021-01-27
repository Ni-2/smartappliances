# SmartAppliances

[![CI](https://github.com/Ni-2/smartappliances/workflows/CI/badge.svg)](https://github.com/Ni-2/smartappliances/actions)
[![GitHub Super-Linter](https://github.com/Ni-2/smartappliances/workflows/Super-Linter/badge.svg)](https://github.com/marketplace/actions/super-linter)
[![Maintainability](https://api.codeclimate.com/v1/badges/5c2375bb750c56c72398/maintainability)](https://codeclimate.com/github/Ni-2/smartappliances/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5c2375bb750c56c72398/test_coverage)](https://codeclimate.com/github/Ni-2/smartappliances/test_coverage)

The simple service for home smart appliances.

Three models of appliances are available now: washing machine, oven, and coffee machine.

To add a new appliance to your cards list you have to enter serial numbers. Here they are:

- Washing Machine: 101, 102, 103
- Oven: 201, 202, 203
- Coffee machine: 301, 302, 303

It considered you might buy two or more equal models. That's why several serials for one model are presented.
And you need to differ them. For that, it is possible to set individual descriptions, for example: in my kitchen, in the bathroom, the vacation home.
You can set this on the appliance page.

The default appliance state is "available." You can choose and run the task for your appliance. The state will be changed after running to "in operation." When the operation is over you will see the state "Done!" and then again "available." It considered that the appliance should send the state to the server and through it to the user. Currently, it is realized by two timers in 10 seconds for each.

To delete the appliance from your cards list go to the appliance page, scroll down and click "Delete appliance."
