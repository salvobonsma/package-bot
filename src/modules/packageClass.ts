import mongoose = require('mongoose')
import { getCourier } from './getCourier'
const trackPackage = require('./trackPackage')

export interface PackageInterface {
    packageNum: string
    courier: string
    status: string[]
    note: string
    deleted: boolean
    getCurrentStatus(): Promise<any>
}

interface packageData {
    packageNum: string
    courier: string
    status: string[]
    note: string
    deleted: boolean
}

const couriers: string[] = ['dpd', 'gls', 'ups', '']

class Package implements PackageInterface {
    packageNum: string
    courier: string
    status: string[]
    note: string
    deleted: boolean

    constructor(data: packageData) {
        if (data.packageNum == undefined) {
            throw new Error('You did not specify the package number!\nProper usage `(p!add / p!track) <package number> <courier>`').message
        }

        var tempCourier: string = data.courier.toLowerCase()

        if (!couriers.includes(tempCourier)) {
            throw new Error(`We don't support the courier "${data.courier}"!\nType \`p!couriers\` to see which couriers we support!`)
                .message
        }

        if (tempCourier == '') {
            var matchCourier: string[] = getCourier(data.packageNum)
            if (matchCourier.length == 0) {
                throw new Error(
                    `Couldn't match any courier to this package number!\nTry specifying the courier or check the list of supported couriers.`
                ).message
            } else if (matchCourier.length > 1) {
                throw new Error(`Your tracking number format matches multiple couriers!\tPlease specify the courier`).message
            } else {
                tempCourier = matchCourier[0]
            }
        }

        this.packageNum = data.packageNum
        this.courier = tempCourier
        this.note = data.note
        this.deleted = data.deleted

        if (data.deleted == undefined) {
            this.deleted = false
        }
        if (data.status != undefined) {
            this.status = data.status
        }
    }

    async getCurrentStatus(): Promise<any> {
        try {
            const currentStatus = await trackPackage(this.packageNum, this.courier)
            this.status = currentStatus
            return currentStatus
        } catch (err) {
            throw new Error(err).message
        }
    }
}

const PackageSchema = new mongoose.Schema({
    packageNum: String,
    courier: String,
    status: Array,
    note: String,
    deleted: Boolean,
})

module.exports.PackageModel = mongoose.model('PackageModel', PackageSchema)
module.exports.Package = Package
